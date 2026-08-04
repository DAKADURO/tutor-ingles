const chatEl = document.getElementById('chat');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const autoSpeak = document.getElementById('autoSpeak');
const statusEl = document.getElementById('status');

let messages = [];

function addMessage(role, content) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = content;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
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
  textInput.value = '';
  statusEl.textContent = 'Pensando...';
  sendBtn.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) throw new Error('Error del servidor');

    const data = await res.json();
    addMessage('assistant', data.reply);
    messages.push({ role: 'assistant', content: data.reply });
    speak(data.reply);
  } catch (err) {
    addMessage('assistant', '(Error: no se pudo conectar con el servidor. Revisa que el servidor esté corriendo y tu API key sea válida.)');
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

// --- Reconocimiento de voz (Web Speech API) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add('recording');
    statusEl.textContent = 'Escuchando... habla en inglés';
  };

  recognition.onend = () => {
    isRecording = false;
    micBtn.classList.remove('recording');
    statusEl.textContent = '';
  };

  recognition.onerror = (event) => {
    console.error('Error de reconocimiento de voz:', event.error);
    statusEl.textContent = `Error de voz: ${event.error}`;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    textInput.value = transcript;
    sendMessage(transcript);
  };

  micBtn.addEventListener('click', () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });
} else {
  micBtn.disabled = true;
  micBtn.title = 'Tu navegador no soporta reconocimiento de voz. Prueba en Chrome.';
}

// Mensaje de bienvenida
addMessage('assistant', "Hi! I'm your English tutor. Let's practice together! You can type or press the microphone to speak. How are you today?");
