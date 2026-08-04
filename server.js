import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error('Falta OPENAI_API_KEY en el archivo .env');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static('public'));

const LEVEL_DESCRIPTIONS = {
  A1: 'principiante absoluto (A1). Usa vocabulario muy basico, oraciones muy cortas y simples (presente simple, palabras de uso diario).',
  A2: 'basico (A2). Usa vocabulario cotidiano, oraciones cortas, tiempos simples (presente, pasado simple, futuro con "going to").',
  B1: 'intermedio (B1). Puedes usar vocabulario mas variado, oraciones un poco mas largas, y tiempos verbales como presente perfecto y condicionales simples.',
};

function buildSystemPrompt(level) {
  const desc = LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.A2;
  return `Eres un tutor de ingles paciente y motivador para un estudiante de nivel ${desc}

Reglas:
- Responde principalmente en ingles, con el nivel de dificultad indicado arriba.
- Si el estudiante comete un error de gramatica o vocabulario, corrigelo con amabilidad y explica el porque brevemente EN ESPANOL, luego continua la conversacion en ingles.
- Haz preguntas de seguimiento para mantener la conversacion fluida.
- Si el estudiante escribe en espanol, respondele en espanol animandolo a intentar en ingles, y dale una frase en ingles que pueda usar.
- Nunca seas condescendiente. Celebra el progreso.`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, level } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages debe ser un array' });
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

app.listen(port, () => {
  console.log(`Tutor de ingles corriendo en http://localhost:${port}`);
});
