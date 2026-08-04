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

const SYSTEM_PROMPT = `Eres un tutor de ingles paciente y motivador para un estudiante principiante (nivel A1-A2).

Reglas:
- Responde principalmente en ingles simple, adecuado para nivel A1-A2.
- Si el estudiante comete un error de gramatica o vocabulario, corrigelo con amabilidad y explica el porque brevemente EN ESPANOL, luego continua la conversacion en ingles.
- Manten las oraciones cortas y el vocabulario basico.
- Haz preguntas de seguimiento para mantener la conversacion fluida.
- Si el estudiante escribe en espanol, respondele en espanol animandolo a intentar en ingles, y dale una frase en ingles que pueda usar.
- Nunca seas condescendiente. Celebra el progreso.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages debe ser un array' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
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
