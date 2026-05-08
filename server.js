require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/transform", async (req, res) => {

  try {

    const { mode, text } = req.body;

    let instruction = "";

    if (mode === "mensajes") {

      instruction = `
Corrige este mensaje para plataformas como AmoLatina.

REGLAS:
- NO convertir en carta
- mantener mensaje corto
- sonar natural y humana
- evitar tono IA
- mejorar ortografía y fluidez
- mantener intención original
- generar tensión e intriga ligera
- sonar femenina y auténtica
- evitar exageración
- evitar textos largos
- mantener sensación real
`;

    }

    if (mode === "cartas") {

      instruction = `
Corrige esta carta para plataformas como AmoLatina.

REGLAS:
- mantener tono femenino y emocional
- sonar natural y elegante
- evitar tono IA
- mantener intriga y conexión
- máximo 500 caracteres aproximadamente
- escribir TODO en un solo párrafo
- evitar textos largos
- evitar múltiples bloques de texto
- mantener sensualidad elegante
- sonar auténtica
- priorizar impacto emocional breve
`;

    }

    if (mode === "recovery") {

      instruction = `
Transforma este texto en recovery emocional elegante para plataformas como AmoLatina.

OBJETIVO:
Debe sentirse como una mujer retomando conexión con un hombre con el que ya existió cierta atención o interés emocional.

REGLAS GENERALES:
- NO sonar como primer contacto
- NO volver a presentarse
- mantener sensación de continuidad
- generar nostalgia ligera
- sonar femenina, madura y auténtica
- evitar dramatismo
- evitar parecer necesitada
- mantener intriga emocional
- NO parecer IA

SI ES MENSAJE:
- mantenerlo corto
- sonar natural y espontáneo
- insinuar reconexión emocional

SI ES CARTA:
- máximo 500 caracteres aproximadamente
- escribir en un solo párrafo
- mantener sensación de cercanía emocional
- dar impresión de que la conexión aún podría retomarse
- evitar textos demasiado largos
`;

    }

    if (mode === "recomendar") {

      instruction = `
Genera una NUEVA versión de este mensaje o carta para plataformas como AmoLatina.

IMPORTANTE:
- NO responder el mensaje
- NO continuar conversación
- NO analizar emocionalmente
- NO escribir como si ya estuvieran hablando

OBJETIVO:
Crear una alternativa mucho más atractiva, natural y optimizada para generar respuesta emocional.

REGLAS:
- mantener la intención original
- cambiar completamente la estructura
- sonar extremadamente humana
- generar curiosidad e intriga
- mantener feminidad auténtica
- evitar sensación IA
- evitar textos aburridos
- evitar frases profundas excesivas
- evitar dramatismo
- sonar espontánea y real
- si es mensaje, mantenerlo corto
- si es carta, máximo 500 caracteres
- si es carta, escribir en un solo párrafo
- priorizar alto CTR emocional
`;

    }

    const response = await openai.chat.completions.create({
      model: "gpt-5.5",
      messages: [
        {
          role: "system",
          content: instruction,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const cleanText = response.choices?.[0]?.message?.content
      ?.replace(/\n+/g, " ")
      ?.replace(/\s+/g, " ")
      ?.trim();

    res.json({
      result: cleanText || "Sin respuesta",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error transforming text",
    });

  }

});
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
