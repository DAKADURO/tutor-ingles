const chatEl = document.getElementById('chat');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const autoSpeak = document.getElementById('autoSpeak');
const statusEl = document.getElementById('status');
const levelSelect = document.getElementById('levelSelect');
const clearBtn = document.getElementById('clearBtn');

const HISTORY_KEY = 'tutorIngles.history';
const LEVEL_KEY = 'tutorIngles.level';

let messages = [];

// --- Historial persistente ---
function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
}

function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return false;
    messages = parsed;
    for (const m of messages) {
      addMessage(m.role, m.content, false);
    }
    return true;
  } catch {
    return false;
  }
}

function clearHistory() {
  if (!confirm('¿Borrar toda la conversación? Esta acción no se puede deshacer.')) return;
  messages = [];
  localStorage.removeItem(HISTORY_KEY);
  chatEl.innerHTML = '';
  addMessage('assistant', "Hi! Let's start a new conversation. How are you today?");
}

// --- Nivel ---
function loadLevel() {
  const saved = localStorage.getItem(LEVEL_KEY);
  if (saved) levelSelect.value = saved;
}

levelSelect.addEventListener('change', () => {
  localStorage.setItem(LEVEL_KEY, levelSelect.value);
});

function addMessage(role, content, persist = true) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = content;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  if (persist) saveHistory();
}

function speak(text) {
  if (!autoSpeak.checked) return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

async function sendMessage(text) {
  if (!text.trim()) return;

  addMessage('user', text);
  messages.push({ role: 'user', content: text });
  saveHistory();
  textInput.value = '';
  statusEl.textContent = 'Pensando...';
  sendBtn.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, level: levelSelect.value }),
    });

    if (!res.ok) throw new Error('Error del servidor');

    const data = await res.json();
    addMessage('assistant', data.reply, false);
    messages.push({ role: 'assistant', content: data.reply });
    saveHistory();
    speak(data.reply);
  } catch (err) {
    addMessage('assistant', '(Error: no se pudo conectar con el servidor. Revisa que el servidor esté corriendo y tu API key sea válida.)', false);
    console.error(err);
  } finally {
    statusEl.textContent = '';
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener('click', () => sendMessage(textInput.value));
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage(textInput.value);
});
clearBtn.addEventListener('click', clearHistory);

// --- Reconocimiento de voz (Web Speech API) — factory reutilizable ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function setupSpeechRecognition(micButton, statusElement, onTranscript) {
  if (!SpeechRecognition) {
    micButton.disabled = true;
    micButton.title = 'Tu navegador no soporta reconocimiento de voz. Prueba en Chrome.';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  let isRecording = false;

  recognition.onstart = () => {
    isRecording = true;
    micButton.classList.add('recording');
    statusElement.textContent = 'Escuchando... habla en inglés';
  };

  recognition.onend = () => {
    isRecording = false;
    micButton.classList.remove('recording');
    statusElement.textContent = '';
  };

  recognition.onerror = (event) => {
    console.error('Error de reconocimiento de voz:', event.error);
    statusElement.textContent = `Error de voz: ${event.error}`;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onTranscript(transcript);
  };

  micButton.addEventListener('click', () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });
}

setupSpeechRecognition(micBtn, statusEl, (transcript) => {
  textInput.value = transcript;
  sendMessage(transcript);
});

// --- Inicializacion del chat ---
loadLevel();
const restored = loadHistory();
if (!restored) {
  addMessage('assistant', "Hi! I'm your English tutor. Let's practice together! You can type or press the microphone to speak. How are you today?");
}

// ============================================================
// Pestañas
// ============================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    tabPanels.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'cardsTab') renderCard();
  });
});

// ============================================================
// Flashcards con repeticion espaciada simple (tipo Leitner)
// ============================================================
const CARDS_KEY = 'tutorIngles.cardsProgress';
const cardArea = document.getElementById('cardArea');
const cardsRemainingEl = document.getElementById('cardsRemaining');
const resetCardsBtn = document.getElementById('resetCardsBtn');

const DAY_MS = 24 * 60 * 60 * 1000;
const INTERVALS = { again: 0, good: 3 * DAY_MS, easy: 7 * DAY_MS };

function loadCardsProgress() {
  try {
    return JSON.parse(localStorage.getItem(CARDS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCardsProgress(progress) {
  localStorage.setItem(CARDS_KEY, JSON.stringify(progress));
}

let cardsProgress = loadCardsProgress();
let currentCardIndex = null;
let cardFlipped = false;

function getDueWords() {
  const now = Date.now();
  return VOCAB_WORDS.filter((w) => {
    const entry = cardsProgress[w.en];
    return !entry || entry.nextReview <= now;
  });
}

function renderCard() {
  const due = getDueWords();
  cardsRemainingEl.textContent = `${due.length} palabra(s) por repasar`;

  if (due.length === 0) {
    cardArea.innerHTML = '<div class="cards-done">🎉 ¡Terminaste el repaso de hoy! Vuelve mañana para más.</div>';
    currentCardIndex = null;
    return;
  }

  const word = due[0];
  currentCardIndex = word.en;
  cardFlipped = false;
  drawCard(word);
}

function drawCard(word) {
  cardArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'flashcard';

  if (!cardFlipped) {
    card.innerHTML = `<div class="word-en">${word.en}</div><div class="hint">Toca la tarjeta para ver la traducción</div>`;
    card.addEventListener('click', () => {
      cardFlipped = true;
      drawCard(word);
    });
    cardArea.appendChild(card);
  } else {
    card.innerHTML = `
      <div class="word-en">${word.en}</div>
      <div class="word-es">${word.es}</div>
      <div class="word-example">"${word.example}"</div>
    `;
    cardArea.appendChild(card);

    const buttons = document.createElement('div');
    buttons.className = 'card-buttons';
    buttons.innerHTML = `
      <button class="btn-again">😵 No lo sabía</button>
      <button class="btn-good">🙂 Lo sabía</button>
      <button class="btn-easy">😎 Fácil</button>
    `;
    cardArea.appendChild(buttons);

    buttons.querySelector('.btn-again').addEventListener('click', () => reviewCard(word, 'again'));
    buttons.querySelector('.btn-good').addEventListener('click', () => reviewCard(word, 'good'));
    buttons.querySelector('.btn-easy').addEventListener('click', () => reviewCard(word, 'easy'));
  }
}

function reviewCard(word, result) {
  cardsProgress[word.en] = { nextReview: Date.now() + INTERVALS[result] };
  saveCardsProgress(cardsProgress);
  renderCard();
}

resetCardsBtn.addEventListener('click', () => {
  if (!confirm('¿Reiniciar todo el progreso de vocabulario?')) return;
  cardsProgress = {};
  saveCardsProgress(cardsProgress);
  renderCard();
});

// ============================================================
// Simulador de entrevista de trabajo
// ============================================================
const interviewSetup = document.getElementById('interviewSetup');
const roleSelect = document.getElementById('roleSelect');
const customRoleInput = document.getElementById('customRoleInput');
const startInterviewBtn = document.getElementById('startInterviewBtn');
const interviewChatEl = document.getElementById('interviewChat');
const interviewInputRow = document.getElementById('interviewInputRow');
const interviewTextInput = document.getElementById('interviewTextInput');
const interviewSendBtn = document.getElementById('interviewSendBtn');
const interviewMicBtn = document.getElementById('interviewMicBtn');
const interviewControls = document.getElementById('interviewControls');
const finishInterviewBtn = document.getElementById('finishInterviewBtn');
const interviewStatusEl = document.getElementById('interviewStatus');

let interviewMessages = [];
let interviewRole = '';
let interviewFinished = false;

roleSelect.addEventListener('change', () => {
  customRoleInput.style.display = roleSelect.value === 'custom' ? 'block' : 'none';
});

function addInterviewMessage(role, content) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = content;
  interviewChatEl.appendChild(div);
  interviewChatEl.scrollTop = interviewChatEl.scrollHeight;
}

async function startInterview() {
  interviewRole = roleSelect.value === 'custom' ? customRoleInput.value.trim() : roleSelect.value;
  if (!interviewRole) {
    alert('Escribe el puesto de trabajo para la entrevista.');
    return;
  }

  interviewMessages = [];
  interviewFinished = false;
  interviewChatEl.innerHTML = '';
  interviewSetup.style.display = 'none';
  interviewInputRow.style.display = 'flex';
  interviewControls.style.display = 'flex';
  finishInterviewBtn.style.display = 'inline-block';
  finishInterviewBtn.textContent = '🏁 Finalizar y ver feedback';

  await sendInterviewTurn('Hello, I am ready to start the interview.');
}

async function sendInterviewTurn(userText) {
  interviewMessages.push({ role: 'user', content: userText });
  interviewStatusEl.textContent = 'Pensando...';
  interviewSendBtn.disabled = true;

  try {
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: interviewMessages, role: interviewRole, level: levelSelect.value }),
    });

    if (!res.ok) throw new Error('Error del servidor');

    const data = await res.json();
    addInterviewMessage('assistant', data.reply);
    interviewMessages.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    addInterviewMessage('assistant', '(Error: no se pudo conectar con el servidor.)');
    console.error(err);
  } finally {
    interviewStatusEl.textContent = '';
    interviewSendBtn.disabled = false;
  }
}

async function sendInterviewMessage(text) {
  if (!text.trim() || interviewFinished) return;
  addInterviewMessage('user', text);
  interviewTextInput.value = '';
  await sendInterviewTurn(text);
}

async function finishInterview() {
  if (interviewFinished) {
    // Ya se mostró el feedback, este clic reinicia todo
    interviewSetup.style.display = 'flex';
    interviewInputRow.style.display = 'none';
    interviewControls.style.display = 'none';
    interviewChatEl.innerHTML = '';
    return;
  }

  interviewFinished = true;
  interviewInputRow.style.display = 'none';
  finishInterviewBtn.textContent = '🔄 Nueva entrevista';
  addInterviewMessage('user', '[Fin de la entrevista — solicitando feedback]');
  await sendInterviewTurn('FINALIZAR_ENTREVISTA');
}

startInterviewBtn.addEventListener('click', startInterview);
interviewSendBtn.addEventListener('click', () => sendInterviewMessage(interviewTextInput.value));
interviewTextInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendInterviewMessage(interviewTextInput.value);
});
finishInterviewBtn.addEventListener('click', finishInterview);

setupSpeechRecognition(interviewMicBtn, interviewStatusEl, (transcript) => {
  interviewTextInput.value = transcript;
  sendInterviewMessage(transcript);
});

// ============================================================
// PWA: registrar service worker
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.warn('No se pudo registrar el service worker:', err);
    });
  });
}
