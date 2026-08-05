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

// ============================================================
// Tema claro/oscuro
// ============================================================
const THEME_KEY = 'tutorIngles.theme';
const themeToggleBtn = document.getElementById('themeToggleBtn');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggleBtn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggleBtn.textContent = '🌙';
  }
}

applyTheme(localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark');

themeToggleBtn.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

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

let lastAssistantReply = '';

function synthesizeSpeech(text, rate = 0.95) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function speak(text) {
  lastAssistantReply = text;
  if (!autoSpeak.checked) return;
  synthesizeSpeech(text);
}

function replayLast() {
  if (!lastAssistantReply) return;
  synthesizeSpeech(lastAssistantReply);
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
    const { cleanText, corrections } = extractCorrections(data.reply);
    addMessage('assistant', cleanText, false);
    messages.push({ role: 'assistant', content: cleanText });
    saveHistory();
    speak(cleanText);
    recordActivity('message');
    corrections.forEach(addMistake);
  } catch (err) {
    addMessage('assistant', '(Error: no se pudo conectar con el servidor. Revisa que el servidor esté corriendo y tu API key sea válida.)', false);
    console.error(err);
  } finally {
    statusEl.textContent = '';
    sendBtn.disabled = false;
  }
}

// ============================================================
// Racha diaria y estadísticas de progreso
// ============================================================
const STATS_KEY = 'tutorIngles.stats';
const streakBadge = document.getElementById('streakBadge');
const milestoneToast = document.getElementById('milestoneToast');
const progressGoal = document.getElementById('progressGoal');
const statsGrid = document.getElementById('statsGrid');
const MILESTONES = [3, 7, 14, 30, 60, 100, 180, 365];
const GOAL_DAYS = 365;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem(STATS_KEY));
    if (s && typeof s === 'object' && Array.isArray(s.activeDates)) return s;
  } catch {
    /* ignora datos corruptos y empieza de nuevo */
  }
  return {
    startDate: todayStr(),
    activeDates: [],
    totalMessages: 0,
    totalInterviews: 0,
    totalListening: 0,
    totalWritings: 0,
    totalMistakesLogged: 0,
    bestStreak: 0,
    unlockedAchievements: [],
  };
}

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

let stats = loadStats();
stats.totalListening = stats.totalListening || 0;
stats.totalWritings = stats.totalWritings || 0;
stats.totalMistakesLogged = stats.totalMistakesLogged || 0;
stats.unlockedAchievements = stats.unlockedAchievements || [];

function getCurrentStreak() {
  const dates = new Set(stats.activeDates);
  let streak = 0;
  const cursor = new Date();
  if (!dates.has(todayStr())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function showMilestoneToast(text) {
  milestoneToast.textContent = text;
  milestoneToast.classList.add('show');
  setTimeout(() => milestoneToast.classList.remove('show'), 3500);
}

function recordActivity(kind) {
  const today = todayStr();
  const isNewDay = !stats.activeDates.includes(today);
  if (isNewDay) stats.activeDates.push(today);
  if (kind === 'message') stats.totalMessages++;
  if (kind === 'interview') stats.totalInterviews++;
  if (kind === 'listening') stats.totalListening++;
  if (kind === 'writing') stats.totalWritings++;

  const streak = getCurrentStreak();
  if (streak > stats.bestStreak) stats.bestStreak = streak;
  saveStats();
  updateStreakBadge();

  if (isNewDay && MILESTONES.includes(streak)) {
    showMilestoneToast(`🎉 ¡${streak} días seguidos practicando! Sigue así.`);
  }

  checkAchievements();
}

function updateStreakBadge() {
  streakBadge.textContent = `🔥 ${getCurrentStreak()}`;
}

function renderProgress() {
  const streak = getCurrentStreak();
  const start = new Date(stats.startDate);
  const daysSinceStart = Math.max(1, Math.floor((Date.now() - start.getTime()) / DAY_MS) + 1);
  const daysLeft = Math.max(0, GOAL_DAYS - daysSinceStart);
  const cardsSeen = Object.keys(cardsProgress).length;
  const cardsMastered = Object.values(cardsProgress).filter((e) => e.nextReview - Date.now() >= 3 * DAY_MS).length;

  progressGoal.innerHTML = `🎯 Objetivo: hablar inglés con confianza en <strong>menos de un año</strong>.<br>
    Llevas <strong>${daysSinceStart}</strong> día(s) desde que empezaste — quedan <strong>${daysLeft}</strong> día(s) para tu meta. ¡La constancia es la clave!`;

  const items = [
    { value: streak, label: 'Racha actual (días)' },
    { value: stats.bestStreak, label: 'Mejor racha' },
    { value: stats.activeDates.length, label: 'Días activos en total' },
    { value: stats.totalMessages, label: 'Mensajes practicados' },
    { value: stats.totalInterviews, label: 'Entrevistas completadas' },
    { value: `${cardsMastered}/${cardsSeen || VOCAB_WORDS.length}`, label: 'Palabras dominadas' },
    { value: mistakes.length, label: 'Errores guardados para repasar' },
    { value: `${Object.keys(grammarProgress).length}/${GRAMMAR_LESSONS.length}`, label: 'Lecciones de gramática' },
    { value: stats.totalListening, label: 'Frases de escucha practicadas' },
    { value: stats.totalWritings, label: 'Textos escritos corregidos' },
  ];

  statsGrid.innerHTML = items
    .map((i) => `<div class="stat-card"><div class="stat-value">${i.value}</div><div class="stat-label">${i.label}</div></div>`)
    .join('');

  renderStreakCalendar();
  renderAchievements();
}

updateStreakBadge();

// ============================================================
// Calendario de racha
// ============================================================
const streakCalendarEl = document.getElementById('streakCalendar');
const STREAK_CALENDAR_DAYS = 84;

function renderStreakCalendar() {
  const activeSet = new Set(stats.activeDates);
  const today = new Date();
  const cells = [];

  for (let i = STREAK_CALENDAR_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, active: activeSet.has(key) });
  }

  streakCalendarEl.innerHTML = cells
    .map((c) => `<div class="cal-cell ${c.active ? 'active' : ''}" title="${c.date}${c.active ? ' — practicaste' : ''}"></div>`)
    .join('');
}

// ============================================================
// Logros
// ============================================================
const achievementsGrid = document.getElementById('achievementsGrid');

function computeCardsMastered() {
  return Object.values(cardsProgress).filter((e) => e.nextReview - Date.now() >= 3 * DAY_MS).length;
}

function isAchievementUnlocked(id) {
  switch (id) {
    case 'first-message':
      return stats.totalMessages >= 1;
    case 'streak-7':
      return stats.bestStreak >= 7;
    case 'streak-30':
      return stats.bestStreak >= 30;
    case 'streak-100':
      return stats.bestStreak >= 100;
    case 'words-50':
      return computeCardsMastered() >= 50;
    case 'words-100':
      return computeCardsMastered() >= 100;
    case 'first-interview':
      return stats.totalInterviews >= 1;
    case 'listening-10':
      return stats.totalListening >= 10;
    case 'writing-5':
      return stats.totalWritings >= 5;
    case 'grammar-all':
      return Object.keys(grammarProgress).length >= GRAMMAR_LESSONS.length;
    case 'mistakes-10':
      return stats.totalMistakesLogged >= 10;
    default:
      return false;
  }
}

function checkAchievements() {
  const previouslyUnlocked = new Set(stats.unlockedAchievements);
  const nowUnlocked = ACHIEVEMENTS.filter((a) => isAchievementUnlocked(a.id)).map((a) => a.id);
  const newlyUnlocked = nowUnlocked.filter((id) => !previouslyUnlocked.has(id));

  if (newlyUnlocked.length > 0 || nowUnlocked.length !== stats.unlockedAchievements.length) {
    stats.unlockedAchievements = nowUnlocked;
    saveStats();
  }

  if (newlyUnlocked.length > 0) {
    const first = ACHIEVEMENTS.find((a) => a.id === newlyUnlocked[0]);
    showMilestoneToast(`🏆 ¡Logro desbloqueado: ${first.title}!`);
  }
}

function renderAchievements() {
  achievementsGrid.innerHTML = ACHIEVEMENTS.map((a) => {
    const unlocked = isAchievementUnlocked(a.id);
    return `
      <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${unlocked ? a.icon : '🔒'}</div>
        <div class="achievement-title">${a.title}</div>
        <div class="achievement-desc">${a.description}</div>
      </div>
    `;
  }).join('');
}

// ============================================================
// Respaldo de datos (exportar / importar)
// ============================================================
const BACKUP_KEYS = [
  'tutorIngles.history',
  'tutorIngles.level',
  'tutorIngles.stats',
  'tutorIngles.cardsProgress',
  'tutorIngles.vocabTopic',
  'tutorIngles.grammarProgress',
  'tutorIngles.mistakes',
];

const exportBackupBtn = document.getElementById('exportBackupBtn');
const importBackupBtn = document.getElementById('importBackupBtn');
const importBackupFile = document.getElementById('importBackupFile');

exportBackupBtn.addEventListener('click', () => {
  const backup = {};
  BACKUP_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) backup[key] = value;
  });
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tutor-ingles-respaldo-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

importBackupBtn.addEventListener('click', () => importBackupFile.click());

importBackupFile.addEventListener('change', () => {
  const file = importBackupFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result);
      if (!confirm('Esto reemplazará tu progreso actual en este dispositivo con el del archivo de respaldo. ¿Continuar?')) return;
      BACKUP_KEYS.forEach((key) => {
        if (backup[key] !== undefined) localStorage.setItem(key, backup[key]);
      });
      alert('¡Respaldo importado! La página se recargará.');
      location.reload();
    } catch (err) {
      alert('El archivo no es un respaldo válido.');
      console.error(err);
    }
  };
  reader.readAsText(file);
  importBackupFile.value = '';
});

// ============================================================
// Sesión
// ============================================================
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
  if (!confirm('¿Cerrar sesión? Tendrás que ingresar el código de acceso de nuevo.')) return;
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch (err) {
    console.error('Error cerrando sesion:', err);
  }
  location.href = '/';
});

// ============================================================
// Recordatorios diarios (notificaciones locales)
// ============================================================
const REMINDER_KEY = 'tutorIngles.remindersEnabled';
const LAST_REMINDER_KEY = 'tutorIngles.lastReminderDate';
const REMINDER_HOUR = 19;
const enableRemindersBtn = document.getElementById('enableRemindersBtn');
const reminderStatusEl = document.getElementById('reminderStatus');

function remindersActive() {
  return localStorage.getItem(REMINDER_KEY) === '1' && 'Notification' in window && Notification.permission === 'granted';
}

function updateReminderButton() {
  const active = remindersActive();
  enableRemindersBtn.textContent = active ? '🔕 Desactivar recordatorios' : '🔔 Activar recordatorios';
  reminderStatusEl.textContent = active
    ? 'Te avisaremos si no has practicado hoy (mientras tengas la app abierta o instalada).'
    : '';
}

async function toggleReminders() {
  if (!('Notification' in window)) {
    alert('Tu navegador no soporta notificaciones.');
    return;
  }

  if (localStorage.getItem(REMINDER_KEY) === '1') {
    localStorage.setItem(REMINDER_KEY, '0');
    updateReminderButton();
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    localStorage.setItem(REMINDER_KEY, '1');
    checkDailyReminder();
  } else {
    alert('No se activaron los recordatorios porque el permiso fue denegado.');
  }
  updateReminderButton();
}

function checkDailyReminder() {
  if (!remindersActive()) return;

  const today = todayStr();
  if (localStorage.getItem(LAST_REMINDER_KEY) === today) return;
  if (stats.activeDates.includes(today)) return;
  if (new Date().getHours() < REMINDER_HOUR) return;

  const streak = getCurrentStreak();
  const body = streak > 0
    ? `Llevas ${streak} día(s) de racha. ¡No la pierdas hoy!`
    : 'Practica unos minutos de inglés hoy para acercarte a tu meta.';

  if (navigator.serviceWorker && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then((reg) => reg.showNotification('🇬🇧 Tutor de Inglés', { body, icon: 'icon.svg' }));
  } else {
    new Notification('🇬🇧 Tutor de Inglés', { body });
  }

  localStorage.setItem(LAST_REMINDER_KEY, today);
}

enableRemindersBtn.addEventListener('click', toggleReminders);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkDailyReminder();
});

updateReminderButton();
checkDailyReminder();

// ============================================================
// Mis errores — correcciones que el tutor extrae del chat,
// repasables con el mismo esquema de repetición espaciada del vocabulario
// ============================================================
const MISTAKES_KEY = 'tutorIngles.mistakes';
const mistakesList = document.getElementById('mistakesList');
const mistakesReviewArea = document.getElementById('mistakesReviewArea');
const mistakesCountEl = document.getElementById('mistakesCount');
const clearMistakesBtn = document.getElementById('clearMistakesBtn');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function makeId() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function extractCorrections(text) {
  const regex = /\[CORRECTION\]([\s\S]*?)\[\/CORRECTION\]/g;
  const corrections = [];
  const cleanText = text
    .replace(regex, (match, json) => {
      try {
        const parsed = JSON.parse(json);
        if (parsed && parsed.wrong && parsed.right) {
          corrections.push({ wrong: parsed.wrong, right: parsed.right, note: parsed.note || '', date: Date.now() });
        }
      } catch {
        /* ignora bloques mal formados del modelo */
      }
      return '';
    })
    .trim();
  return { cleanText, corrections };
}

function loadMistakes() {
  try {
    const m = JSON.parse(localStorage.getItem(MISTAKES_KEY));
    if (!Array.isArray(m)) return [];
    return m.map((entry) => ({
      ...entry,
      id: entry.id || makeId(),
      nextReview: entry.nextReview ?? Date.now(),
    }));
  } catch {
    return [];
  }
}

function saveMistakes() {
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
}

let mistakes = loadMistakes();
let mistakesMode = 'review';

function addMistake(entry) {
  mistakes.unshift({ ...entry, id: makeId(), nextReview: Date.now() });
  mistakes = mistakes.slice(0, 200);
  saveMistakes();
  stats.totalMistakesLogged++;
  saveStats();
  checkAchievements();
}

function renderMistakesTab() {
  const reviewActive = mistakesMode === 'review';
  mistakesReviewArea.style.display = reviewActive ? 'flex' : 'none';
  mistakesList.style.display = reviewActive ? 'none' : 'flex';
  if (reviewActive) renderMistakesReview();
  else renderMistakesList();
}

document.querySelectorAll('#mistakesTab .mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mistakesTab .mode-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    mistakesMode = btn.dataset.mode;
    renderMistakesTab();
  });
});

function getDueMistakes() {
  const now = Date.now();
  return mistakes.filter((m) => !m.nextReview || m.nextReview <= now);
}

let mistakeFlipped = false;

function renderMistakesReview() {
  const due = getDueMistakes();

  if (mistakes.length === 0) {
    mistakesCountEl.textContent = '';
    mistakesReviewArea.innerHTML = '<div class="mistakes-empty">Aún no tienes errores guardados. Sigue practicando en el Chat y aquí aparecerán tus correcciones para repasar.</div>';
    return;
  }

  mistakesCountEl.textContent = `${due.length} error(es) por repasar de ${mistakes.length} guardado(s)`;

  if (due.length === 0) {
    mistakesReviewArea.innerHTML = '<div class="cards-done">🎉 ¡Repasaste todos tus errores por ahora! Vuelve más tarde.</div>';
    return;
  }

  mistakeFlipped = false;
  drawMistakeCard(due[0]);
}

function drawMistakeCard(mistake) {
  mistakesReviewArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'flashcard';

  if (!mistakeFlipped) {
    card.innerHTML = `<div class="mistake-prompt">${escapeHtml(mistake.wrong)}</div><div class="hint">¿Cómo se dice correctamente? Toca para ver la respuesta.</div>`;
    card.addEventListener('click', () => {
      mistakeFlipped = true;
      drawMistakeCard(mistake);
    });
    mistakesReviewArea.appendChild(card);
  } else {
    card.innerHTML = `
      <div class="mistake-prompt">${escapeHtml(mistake.wrong)}</div>
      <div class="word-es">✅ ${escapeHtml(mistake.right)}</div>
      ${mistake.note ? `<div class="word-example">${escapeHtml(mistake.note)}</div>` : ''}
    `;
    mistakesReviewArea.appendChild(card);

    const buttons = document.createElement('div');
    buttons.className = 'card-buttons';
    buttons.innerHTML = `
      <button class="btn-again">😵 No lo sabía</button>
      <button class="btn-good">🙂 Lo sabía</button>
      <button class="btn-easy">😎 Fácil</button>
    `;
    mistakesReviewArea.appendChild(buttons);

    buttons.querySelector('.btn-again').addEventListener('click', () => reviewMistake(mistake, 'again'));
    buttons.querySelector('.btn-good').addEventListener('click', () => reviewMistake(mistake, 'good'));
    buttons.querySelector('.btn-easy').addEventListener('click', () => reviewMistake(mistake, 'easy'));
  }
}

function reviewMistake(mistake, result) {
  const target = mistakes.find((m) => m.id === mistake.id);
  if (target) target.nextReview = Date.now() + INTERVALS[result];
  saveMistakes();
  renderMistakesReview();
}

function renderMistakesList() {
  mistakesCountEl.textContent = `${mistakes.length} error(es) guardado(s)`;

  if (mistakes.length === 0) {
    mistakesList.innerHTML = '<div class="mistakes-empty">Aún no tienes errores guardados. Sigue practicando en el Chat y aquí aparecerán tus correcciones para repasar.</div>';
    return;
  }

  mistakesList.innerHTML = mistakes
    .map(
      (m) => `
      <div class="mistake-card">
        <div class="mistake-wrong">${escapeHtml(m.wrong)}</div>
        <div class="mistake-right">✅ ${escapeHtml(m.right)}</div>
        ${m.note ? `<div class="mistake-note">${escapeHtml(m.note)}</div>` : ''}
        <div class="mistake-date">${new Date(m.date).toLocaleDateString()}</div>
        <button class="clear-btn" data-id="${m.id}" style="margin-top:8px;">🗑️ Quitar</button>
      </div>
    `
    )
    .join('');

  mistakesList.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mistakes = mistakes.filter((m) => m.id !== btn.dataset.id);
      saveMistakes();
      renderMistakesTab();
    });
  });
}

clearMistakesBtn.addEventListener('click', () => {
  if (!confirm('¿Borrar todos los errores guardados?')) return;
  mistakes = [];
  saveMistakes();
  renderMistakesTab();
});

sendBtn.addEventListener('click', () => sendMessage(textInput.value));
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage(textInput.value);
});
clearBtn.addEventListener('click', clearHistory);
document.getElementById('replayBtn').addEventListener('click', replayLast);

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
      return;
    }
    // Si la IA esta hablando, interrumpirla a proposito antes de escuchar,
    // para que no compitan por el audio y el usuario sepa por que se corto.
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    recognition.start();
  });
}

// El texto reconocido se coloca en la caja de texto para que el usuario lo
// revise y confirme — no se envia automaticamente, para evitar envios
// accidentales antes de terminar de hablar.
setupSpeechRecognition(micBtn, statusEl, (transcript) => {
  textInput.value = transcript;
  textInput.focus();
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
    if (btn.dataset.tab === 'progressTab') renderProgress();
    if (btn.dataset.tab === 'grammarTab') renderGrammarList();
    if (btn.dataset.tab === 'mistakesTab') renderMistakesTab();
    if (btn.dataset.tab === 'listeningTab') renderListeningTab();
  });
});

// ============================================================
// Flashcards con repeticion espaciada simple (tipo Leitner)
// ============================================================
const CARDS_KEY = 'tutorIngles.cardsProgress';
const TOPIC_KEY = 'tutorIngles.vocabTopic';
const cardArea = document.getElementById('cardArea');
const cardsRemainingEl = document.getElementById('cardsRemaining');
const resetCardsBtn = document.getElementById('resetCardsBtn');
const topicSelect = document.getElementById('topicSelect');

const DAY_MS = 24 * 60 * 60 * 1000;
const INTERVALS = { again: 0, good: 3 * DAY_MS, easy: 7 * DAY_MS };

function populateTopicSelect() {
  topicSelect.innerHTML = ['<option value="all">🗂️ Todos los temas</option>']
    .concat(VOCAB_TOPICS.map((t) => `<option value="${t.id}">${t.icon} ${t.name}</option>`))
    .join('');
  const saved = localStorage.getItem(TOPIC_KEY);
  if (saved) topicSelect.value = saved;
}

populateTopicSelect();

topicSelect.addEventListener('change', () => {
  localStorage.setItem(TOPIC_KEY, topicSelect.value);
  renderCard();
});

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
  const topic = topicSelect.value;
  return VOCAB_WORDS.filter((w) => topic === 'all' || w.topic === topic).filter((w) => {
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
    card.innerHTML = `
      <div class="word-row">
        <div class="word-en">${word.en}</div>
        <button class="speaker-btn" title="Escuchar">🔊</button>
      </div>
      <div class="hint">Toca la tarjeta para ver la traducción</div>
    `;
    card.querySelector('.speaker-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      synthesizeSpeech(word.en);
    });
    card.addEventListener('click', () => {
      cardFlipped = true;
      drawCard(word);
    });
    cardArea.appendChild(card);
  } else {
    card.innerHTML = `
      <div class="word-row">
        <div class="word-en">${word.en}</div>
        <button class="speaker-btn" title="Escuchar">🔊</button>
      </div>
      <div class="word-es">${word.es}</div>
      <div class="word-example">"${word.example}"</div>
      <button class="pron-btn">🎙️ Practicar pronunciación</button>
      <div class="pron-result"></div>
    `;
    card.querySelector('.speaker-btn').addEventListener('click', () => synthesizeSpeech(word.en));
    cardArea.appendChild(card);
    setupPronunciationPractice(word, card.querySelector('.pron-btn'), card.querySelector('.pron-result'));

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

// --- Práctica de pronunciación (compara lo que dices con la palabra objetivo) ---
let pronRecognition = null;

function getPronRecognition() {
  if (!SpeechRecognition) return null;
  if (!pronRecognition) {
    pronRecognition = new SpeechRecognition();
    pronRecognition.lang = 'en-US';
    pronRecognition.interimResults = false;
    pronRecognition.maxAlternatives = 1;
  }
  return pronRecognition;
}

function normalizeForCompare(str) {
  return str
    .toLowerCase()
    .replace(/^to\s+/, '')
    .replace(/[^a-z0-9\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function setupPronunciationPractice(word, btn, resultEl) {
  const recognition = getPronRecognition();
  if (!recognition) {
    btn.disabled = true;
    btn.title = 'Tu navegador no soporta reconocimiento de voz. Prueba en Chrome.';
    return;
  }

  let isRecording = false;

  recognition.onstart = () => {
    isRecording = true;
    btn.classList.add('recording');
    resultEl.textContent = 'Escuchando...';
    resultEl.className = 'pron-result';
  };

  recognition.onend = () => {
    isRecording = false;
    btn.classList.remove('recording');
  };

  recognition.onerror = (event) => {
    isRecording = false;
    btn.classList.remove('recording');
    resultEl.textContent = `Error de voz: ${event.error}`;
    resultEl.className = 'pron-result wrong';
  };

  recognition.onresult = (event) => {
    const heard = event.results[0][0].transcript;
    if (normalizeForCompare(heard) === normalizeForCompare(word.en)) {
      resultEl.textContent = '✅ ¡Perfecto! Tu pronunciación fue clara.';
      resultEl.className = 'pron-result correct';
    } else {
      resultEl.textContent = `🔁 Escuché: "${heard}". Intenta decir: "${word.en}"`;
      resultEl.className = 'pron-result wrong';
    }
  };

  btn.onclick = () => {
    if (isRecording) {
      recognition.stop();
      return;
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    resultEl.textContent = '';
    resultEl.className = 'pron-result';
    recognition.start();
  };
}

function reviewCard(word, result) {
  cardsProgress[word.en] = { nextReview: Date.now() + INTERVALS[result] };
  saveCardsProgress(cardsProgress);
  checkAchievements();
  renderCard();
}

resetCardsBtn.addEventListener('click', () => {
  if (!confirm('¿Reiniciar todo el progreso de vocabulario?')) return;
  cardsProgress = {};
  saveCardsProgress(cardsProgress);
  renderCard();
});

// ============================================================
// Mini-lecciones de gramática
// ============================================================
const GRAMMAR_PROGRESS_KEY = 'tutorIngles.grammarProgress';
const grammarList = document.getElementById('grammarList');
const grammarDetail = document.getElementById('grammarDetail');

function loadGrammarProgress() {
  try {
    const g = JSON.parse(localStorage.getItem(GRAMMAR_PROGRESS_KEY));
    return g && typeof g === 'object' ? g : {};
  } catch {
    return {};
  }
}

function saveGrammarProgress() {
  localStorage.setItem(GRAMMAR_PROGRESS_KEY, JSON.stringify(grammarProgress));
}

let grammarProgress = loadGrammarProgress();

function renderGrammarList() {
  grammarDetail.style.display = 'none';
  grammarList.style.display = 'flex';

  const lessons = GRAMMAR_LESSONS.filter((l) => l.level === levelSelect.value);
  grammarList.innerHTML = lessons
    .map(
      (l) => `
      <div class="grammar-item" data-id="${l.id}">
        <span>${l.title}</span>
        ${grammarProgress[l.id] ? '<span class="badge-done">✅</span>' : ''}
      </div>
    `
    )
    .join('');

  grammarList.querySelectorAll('.grammar-item').forEach((item) => {
    item.addEventListener('click', () => {
      const lesson = GRAMMAR_LESSONS.find((l) => l.id === item.dataset.id);
      renderGrammarDetail(lesson);
    });
  });
}

function renderGrammarDetail(lesson) {
  grammarList.style.display = 'none';
  grammarDetail.style.display = 'block';
  grammarDetail.innerHTML = `
    <button class="back-btn">← Volver a lecciones</button>
    <h2>${lesson.title}</h2>
    <div class="explanation">${lesson.explanation}</div>
    <div class="example">${lesson.example}</div>
    <div class="exercise">
      <div class="exercise-question">${lesson.exercise.question}</div>
      ${lesson.exercise.options.map((opt, i) => `<button class="option-btn" data-index="${i}">${opt}</button>`).join('')}
      <div class="exercise-feedback"></div>
    </div>
  `;

  grammarDetail.querySelector('.back-btn').addEventListener('click', renderGrammarList);

  const optionButtons = grammarDetail.querySelectorAll('.option-btn');
  const feedbackEl = grammarDetail.querySelector('.exercise-feedback');
  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      optionButtons.forEach((b) => (b.disabled = true));
      if (idx === lesson.exercise.correct) {
        btn.classList.add('correct');
        feedbackEl.textContent = lesson.exercise.feedbackCorrect;
        grammarProgress[lesson.id] = true;
        saveGrammarProgress();
        checkAchievements();
      } else {
        btn.classList.add('wrong');
        optionButtons[lesson.exercise.correct].classList.add('correct');
        feedbackEl.textContent = lesson.exercise.feedbackWrong;
      }
    });
  });
}

// ============================================================
// Escucha / dictado
// ============================================================
const listeningArea = document.getElementById('listeningArea');
let listeningMode = 'sentences';

document.querySelectorAll('.listening-mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.listening-mode-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    listeningMode = btn.dataset.mode;
    renderListeningTab();
  });
});

function renderListeningTab() {
  if (listeningMode === 'dialogues') renderListeningDialogues();
  else renderListening();
}

function speakSequence(texts, onDone) {
  if (!('speechSynthesis' in window)) {
    onDone?.();
    return;
  }
  window.speechSynthesis.cancel();
  let i = 0;
  function next() {
    if (i >= texts.length) {
      onDone?.();
      return;
    }
    const text = texts[i];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      clearTimeout(fallbackTimer);
      i++;
      setTimeout(next, 400);
    };

    utterance.onend = advance;
    utterance.onerror = advance;
    // Salvaguarda: si el navegador no dispara ningun evento (por ejemplo, sin voces
    // de sintesis instaladas), no dejamos la reproduccion colgada para siempre.
    const fallbackTimer = setTimeout(advance, Math.max(2500, text.length * 90));

    window.speechSynthesis.speak(utterance);
  }
  next();
}

let listeningQueue = [];
let listeningIndex = 0;
let listeningChecked = false;

function buildListeningQueue() {
  const pool = LISTENING_SENTENCES.filter((s) => s.level === levelSelect.value);
  listeningQueue = [...pool].sort(() => Math.random() - 0.5);
  listeningIndex = 0;
}

let dialogueQueue = [];
let dialogueIndex = 0;

function buildDialogueQueue() {
  const pool = LISTENING_DIALOGUES.filter((d) => d.level === levelSelect.value);
  dialogueQueue = [...pool].sort(() => Math.random() - 0.5);
  dialogueIndex = 0;
}

function renderListeningDialogues() {
  if (dialogueQueue.length === 0) buildDialogueQueue();

  if (dialogueIndex >= dialogueQueue.length) {
    listeningArea.innerHTML = `
      <div class="cards-done">🎉 ¡Terminaste los diálogos de este nivel!</div>
      <button id="dialogueRestartBtn" class="send-btn">🔄 Repetir</button>
    `;
    document.getElementById('dialogueRestartBtn').addEventListener('click', () => {
      buildDialogueQueue();
      renderListeningDialogues();
    });
    return;
  }

  const dialogue = dialogueQueue[dialogueIndex];
  let answered = false;
  listeningArea.innerHTML = `
    <div class="listening-progress">Diálogo ${dialogueIndex + 1} de ${dialogueQueue.length}</div>
    <button id="dialoguePlayBtn" class="pron-btn">🔊 Escuchar el diálogo</button>
    <div id="dialogueQuestion" class="dialogue-question" style="display:none;"></div>
  `;

  const playBtn = document.getElementById('dialoguePlayBtn');
  const questionArea = document.getElementById('dialogueQuestion');

  function showQuestion() {
    questionArea.style.display = 'block';
    questionArea.innerHTML = `
      <div class="exercise-question">${dialogue.question}</div>
      ${dialogue.options.map((opt, i) => `<button class="option-btn" data-index="${i}">${opt}</button>`).join('')}
      <div class="exercise-feedback"></div>
      <button id="dialogueNextBtn" class="send-btn" style="margin-top:12px;display:none;">Siguiente →</button>
    `;

    const optionButtons = questionArea.querySelectorAll('.option-btn');
    const feedbackEl = questionArea.querySelector('.exercise-feedback');
    const nextBtn = document.getElementById('dialogueNextBtn');

    optionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        recordActivity('listening');
        const idx = Number(btn.dataset.index);
        optionButtons.forEach((b) => (b.disabled = true));
        if (idx === dialogue.correct) {
          btn.classList.add('correct');
          feedbackEl.textContent = '✅ ¡Correcto!';
        } else {
          btn.classList.add('wrong');
          optionButtons[dialogue.correct].classList.add('correct');
          feedbackEl.textContent = `❌ La respuesta correcta era: ${dialogue.options[dialogue.correct]}`;
        }
        nextBtn.style.display = 'block';
      });
    });

    nextBtn.addEventListener('click', () => {
      dialogueIndex++;
      renderListeningDialogues();
    });
  }

  playBtn.addEventListener('click', () => {
    playBtn.disabled = true;
    playBtn.textContent = '🔊 Reproduciendo...';
    speakSequence(
      dialogue.lines.map((l) => l.text),
      () => {
        playBtn.disabled = false;
        playBtn.textContent = '🔊 Escuchar de nuevo';
        showQuestion();
      }
    );
  });
}

function renderListening() {
  if (listeningQueue.length === 0) buildListeningQueue();

  if (listeningIndex >= listeningQueue.length) {
    listeningArea.innerHTML = `
      <div class="cards-done">🎉 ¡Terminaste las frases de este nivel!</div>
      <button id="listeningRestartBtn" class="send-btn">🔄 Repetir</button>
    `;
    document.getElementById('listeningRestartBtn').addEventListener('click', () => {
      buildListeningQueue();
      renderListening();
    });
    return;
  }

  listeningChecked = false;
  const sentence = listeningQueue[listeningIndex];
  listeningArea.innerHTML = `
    <div class="listening-progress">Frase ${listeningIndex + 1} de ${listeningQueue.length}</div>
    <button id="listeningPlayBtn" class="pron-btn">🔊 Escuchar la frase</button>
    <input id="listeningInput" type="text" class="custom-role-input" placeholder="Escribe lo que escuchaste..." autocomplete="off" style="margin-top:16px;width:100%;max-width:380px;" />
    <button id="listeningCheckBtn" class="send-btn" style="margin-top:12px;">Verificar</button>
    <div id="listeningFeedback" class="pron-result"></div>
  `;

  const playBtn = document.getElementById('listeningPlayBtn');
  const input = document.getElementById('listeningInput');
  const checkBtn = document.getElementById('listeningCheckBtn');
  const feedback = document.getElementById('listeningFeedback');

  playBtn.addEventListener('click', () => synthesizeSpeech(sentence.text, 0.85));
  synthesizeSpeech(sentence.text, 0.85);

  function checkAnswer() {
    if (listeningChecked) {
      listeningIndex++;
      renderListening();
      return;
    }
    listeningChecked = true;
    recordActivity('listening');
    if (normalizeForCompare(input.value) === normalizeForCompare(sentence.text)) {
      feedback.textContent = '✅ ¡Perfecto!';
      feedback.className = 'pron-result correct';
    } else {
      feedback.textContent = `🔁 Escribiste: "${input.value || '(nada)'}"\nCorrecto: "${sentence.text}"`;
      feedback.className = 'pron-result wrong';
      feedback.style.whiteSpace = 'pre-wrap';
    }
    checkBtn.textContent = 'Siguiente →';
  }

  checkBtn.addEventListener('click', checkAnswer);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
  input.focus();
}

// ============================================================
// Práctica de escritura
// ============================================================
const writingPromptEl = document.getElementById('writingPrompt');
const writingInput = document.getElementById('writingInput');
const submitWritingBtn = document.getElementById('submitWritingBtn');
const writingStatusEl = document.getElementById('writingStatus');
const writingFeedbackEl = document.getElementById('writingFeedback');
const newWritingPromptBtn = document.getElementById('newWritingPromptBtn');

function pickWritingPrompt() {
  const pool = WRITING_PROMPTS.filter((p) => p.level === levelSelect.value);
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  writingPromptEl.textContent = `✍️ ${prompt.text}`;
  writingInput.value = '';
  writingFeedbackEl.textContent = '';
}

newWritingPromptBtn.addEventListener('click', pickWritingPrompt);

async function submitWriting() {
  const text = writingInput.value.trim();
  if (!text) return;

  writingStatusEl.textContent = 'Revisando...';
  submitWritingBtn.disabled = true;

  try {
    const res = await fetch('/api/writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, level: levelSelect.value }),
    });

    if (!res.ok) throw new Error('Error del servidor');

    const data = await res.json();
    writingFeedbackEl.textContent = data.feedback;
    recordActivity('writing');
  } catch (err) {
    writingFeedbackEl.textContent = '(Error: no se pudo conectar con el servidor.)';
    console.error(err);
  } finally {
    writingStatusEl.textContent = '';
    submitWritingBtn.disabled = false;
  }
}

submitWritingBtn.addEventListener('click', submitWriting);
pickWritingPrompt();

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
  recordActivity('interview');
}

startInterviewBtn.addEventListener('click', startInterview);
interviewSendBtn.addEventListener('click', () => sendInterviewMessage(interviewTextInput.value));
interviewTextInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendInterviewMessage(interviewTextInput.value);
});
finishInterviewBtn.addEventListener('click', finishInterview);

setupSpeechRecognition(interviewMicBtn, interviewStatusEl, (transcript) => {
  interviewTextInput.value = transcript;
  interviewTextInput.focus();
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
