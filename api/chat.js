// /api/chat.js
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const historialUsuario = req.body.historial;

  if (!historialUsuario || historialUsuario.length === 0) {
    return res.status(400).json({ error: 'El historial de mensajes no puede estar vacío' });
  }

  try {
    const respuesta = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        temperature: 0.7,
        system:
          "Act as an educational guide that encourages critical thinking. Never explain the topic directly or give speeches. Don't list steps. Your only task is to ask one or two open-ended questions to invite the user to reflect and reason for themselves. Use short answers, maximum 1 or 2 sentences. Don't mention your role or give introductions like ‘exploring new topics can be exciting’. Always respond in the same language as the user's last message.",
        messages: historialUsuario
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    if (respuesta.data.content && respuesta.data.content[0]) {
      res.status(200).json({ respuesta: respuesta.data.content[0].text });
    } else {
      res.status(500).json({ error: 'No se pudo obtener la respuesta de Claude' });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Error al comunicar con Claude' });
  }
};
