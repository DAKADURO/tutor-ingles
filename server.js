import 'dotenv/config';
import crypto from 'crypto';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error('Falta OPENAI_API_KEY en el archivo .env');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(cookieParser());

// ============================================================
// Control de acceso: codigo compartido + solicitud por correo
// ============================================================
const ACCESS_CODE = process.env.APP_ACCESS_CODE || null;
const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 dias
const activeSessions = new Set();

const mailTransporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
  : null;

if (ACCESS_CODE && !mailTransporter) {
  console.warn('APP_ACCESS_CODE esta configurado pero GMAIL_USER/GMAIL_APP_PASSWORD no. El formulario de "solicitar acceso" no podra enviar correos.');
}

function isAuthed(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  return Boolean(token && activeSessions.has(token));
}

const accessRequestLog = new Map(); // ip -> timestamps recientes
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const recent = (accessRequestLog.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  accessRequestLog.set(ip, recent);
  return recent.length > 5;
}

app.use((req, res, next) => {
  if (!ACCESS_CODE) return next(); // sin codigo configurado, la app queda abierta (solo para desarrollo)

  const publicPaths = new Set(['/login.html', '/api/login', '/api/request-access']);
  if (publicPaths.has(req.path)) return next();
  if (isAuthed(req)) return next();
  if (req.path === '/' || req.path === '/index.html') {
    return res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
  }
  return res.status(401).json({ error: 'No autorizado. Inicia sesion en /login.html' });
});

app.post('/api/login', (req, res) => {
  const { code } = req.body;

  if (!ACCESS_CODE) {
    return res.status(400).json({ error: 'Esta app no tiene un codigo de acceso configurado.' });
  }
  if (typeof code !== 'string' || code !== ACCESS_CODE) {
    return res.status(401).json({ error: 'Codigo incorrecto.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.add(token);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure,
    maxAge: SESSION_MAX_AGE_MS,
  });
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) activeSessions.delete(token);
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.post('/api/request-access', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Nombre y correo son requeridos.' });
  }
  if (isRateLimited(req.ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta mas tarde.' });
  }
  if (!mailTransporter) {
    console.error('Solicitud de acceso recibida pero el envio de correo no esta configurado:', { name, email, message });
    return res.status(500).json({ error: 'El envio de correos no esta configurado en el servidor.' });
  }

  try {
    await mailTransporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `Solicitud de acceso a Tutor de Ingles - ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message || '(sin mensaje)'}\n\nIP: ${req.ip}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error enviando correo de solicitud de acceso:', err.message);
    res.status(500).json({ error: 'No se pudo enviar la solicitud. Intenta de nuevo mas tarde.' });
  }
});

app.use(express.static('public'));

// ============================================================
// Limite diario de uso de IA (proteccion de costo de la API key)
// ============================================================
const DAILY_AI_LIMIT = Number(process.env.DAILY_AI_LIMIT) || 150;
const aiUsageLog = new Map(); // clave (sesion o ip) -> { date, count }

function checkAiQuota(req) {
  const key = req.cookies?.[SESSION_COOKIE] || req.ip;
  const today = new Date().toISOString().slice(0, 10);
  const entry = aiUsageLog.get(key);

  if (!entry || entry.date !== today) {
    aiUsageLog.set(key, { date: today, count: 1 });
    return true;
  }
  if (entry.count >= DAILY_AI_LIMIT) return false;
  entry.count++;
  return true;
}

const LEVEL_DESCRIPTIONS = {
  A1: 'principiante absoluto (A1). Usa vocabulario muy basico, oraciones muy cortas y simples (presente simple, palabras de uso diario).',
  A2: 'basico (A2). Usa vocabulario cotidiano, oraciones cortas, tiempos simples (presente, pasado simple, futuro con "going to").',
  B1: 'intermedio (B1). Puedes usar vocabulario mas variado, oraciones un poco mas largas, y tiempos verbales como presente perfecto y condicionales simples.',
  B2: 'intermedio alto (B2). Usa vocabulario mas amplio y preciso, oraciones complejas con clausulas subordinadas, y tiempos verbales avanzados como pasado perfecto, voz pasiva y condicionales mixtos.',
  C1: 'avanzado (C1). Usa vocabulario sofisticado y expresiones idiomaticas, estructuras gramaticales complejas (discurso indirecto, tercer condicional), y un registro mas formal cuando sea apropiado.',
  C2: 'dominio casi nativo (C2). Usa ingles con fluidez y precision, matices sutiles, humor, ironia, estructuras enfaticas (inversion, subjuntivo), y vocabulario muy especializado cuando el contexto lo requiera.',
};

function buildSystemPrompt(level) {
  const desc = LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.A2;
  return `Eres un tutor de ingles paciente y motivador para un estudiante de nivel ${desc}

Reglas:
- Responde principalmente en ingles, con el nivel de dificultad indicado arriba.
- Si el estudiante comete un error de gramatica o vocabulario, corrigelo con amabilidad y explica el porque brevemente EN ESPANOL, luego continua la conversacion en ingles.
- Haz preguntas de seguimiento para mantener la conversacion fluida.
- Si el estudiante escribe en espanol, respondele en espanol animandolo a intentar en ingles, y dale una frase en ingles que pueda usar.
- Nunca seas condescendiente. Celebra el progreso.
- Si corregiste un error relevante de gramatica u ortografia en este turno, agrega al FINAL de tu respuesta, en su propia linea, un bloque con este formato EXACTO (una sola linea, JSON valido y compacto, sin texto extra antes ni despues de las etiquetas):
[CORRECTION]{"wrong":"lo que escribio el estudiante","right":"como decirlo correctamente","note":"explicacion breve en espanol"}[/CORRECTION]
  Si no hubo ningun error que corregir en este turno, NO agregues ese bloque.`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, level } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages debe ser un array' });
    }
    if (!checkAiQuota(req)) {
      return res.status(429).json({ error: `Alcanzaste el limite diario de ${DAILY_AI_LIMIT} mensajes de IA. Vuelve manana.` });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: buildSystemPrompt(level) }, ...messages],
      max_tokens: 400,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Error llamando a OpenAI:', err.message);
    res.status(500).json({ error: 'Error al generar respuesta' });
  }
});

function buildInterviewSystemPrompt(role, level) {
  const desc = LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.A2;
  return `Eres un entrevistador de Recursos Humanos profesional, realizando una entrevista de trabajo EN INGLES para el puesto de "${role}".

El candidato tiene nivel de ingles ${desc}

Reglas:
- Actua como una entrevista real y profesional. Preséntate brevemente en tu primer mensaje (nombre ficticio, la empresa ficticia, el puesto) y luego haz UNA pregunta de entrevista a la vez, adecuada para el puesto de "${role}".
- Espera la respuesta del candidato antes de hacer la siguiente pregunta.
- Usa ingles con el nivel de dificultad indicado arriba.
- A diferencia de un tutor normal, NO corrijas cada error de gramatica durante la entrevista — mantén el realismo, como lo haria un entrevistador real (que no interrumpe para corregir ingles). Sigue la conversacion con naturalidad aunque haya errores menores.
- Haz entre 5 y 8 preguntas variadas: sobre experiencia, fortalezas/debilidades, situaciones hipoteticas, motivacion para el puesto, etc.
- Si el candidato escribe "FINALIZAR_ENTREVISTA", DEJA DE ACTUAR COMO ENTREVISTADOR y en su lugar da retroalimentacion detallada Y EN ESPANOL sobre su desempeño: 1) Fortalezas de sus respuestas, 2) Errores de ingles importantes que cometio (cita ejemplos concretos de lo que escribio y como decirlo mejor), 3) Sugerencias para mejorar el contenido de sus respuestas (no solo el idioma), 4) Una puntuacion aproximada del 1 al 10. Se constructivo y motivador.
- IMPORTANTE: Nunca uses markdown (nada de **negrita**, #, -, etc). Escribe texto plano, usando saltos de linea y numeros simples como "1)" para organizar las ideas.`;
}

app.post('/api/interview', async (req, res) => {
  try {
    const { messages, role, level } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages debe ser un array' });
    }
    if (!role || typeof role !== 'string') {
      return res.status(400).json({ error: 'role es requerido' });
    }
    if (!checkAiQuota(req)) {
      return res.status(429).json({ error: `Alcanzaste el limite diario de ${DAILY_AI_LIMIT} mensajes de IA. Vuelve manana.` });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: buildInterviewSystemPrompt(role, level) }, ...messages],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Error llamando a OpenAI (interview):', err.message);
    res.status(500).json({ error: 'Error al generar respuesta' });
  }
});

function buildWritingSystemPrompt(level) {
  const desc = LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.A2;
  return `Eres un profesor de ingles revisando un texto escrito por un estudiante de nivel ${desc}

Reglas:
- Da tu respuesta EN ESPANOL (excepto las partes en ingles que cites textualmente).
- Estructura tu respuesta en tres partes, usando texto plano sin markdown (nada de **negrita**, #, -, etc), usando numeros simples como "1)":
  1) Version corregida: el texto del estudiante reescrito correctamente en ingles.
  2) Errores principales: los 3-5 errores mas importantes, citando lo que escribio y como corregirlo, con una explicacion breve.
  3) Sugerencias: 1-2 sugerencias para mejorar el contenido o el vocabulario (no solo gramatica).
- Se motivador y constructivo: celebra algo que el estudiante hizo bien antes de las correcciones.`;
}

app.post('/api/writing', async (req, res) => {
  try {
    const { text, level } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text es requerido' });
    }
    if (!checkAiQuota(req)) {
      return res.status(429).json({ error: `Alcanzaste el limite diario de ${DAILY_AI_LIMIT} mensajes de IA. Vuelve manana.` });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildWritingSystemPrompt(level) },
        { role: 'user', content: text },
      ],
      max_tokens: 600,
    });

    const feedback = completion.choices[0].message.content;
    res.json({ feedback });
  } catch (err) {
    console.error('Error llamando a OpenAI (writing):', err.message);
    res.status(500).json({ error: 'Error al generar retroalimentacion' });
  }
});

app.listen(port, () => {
  console.log(`Tutor de ingles corriendo en http://localhost:${port}`);
});
