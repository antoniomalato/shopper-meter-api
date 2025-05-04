import axios from 'axios';
import dotenv from 'dotenv';

  dotenv.config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';

const apiKey = process.env.GEMINI_API_KEY;

export async function getMeasureFromImage(base64Image: string): Promise<number> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment');
  }

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    {
      contents: [
        {
          parts: [
            {
              text: "Leia o número de um medidor de água ou gás e retorne apenas o valor numérico, sem nenhuma explica ção.",
            },
            {
              inline_data: {
                mime_type: 'image/png',
                data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
          ],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const candidates = response.data.candidates;

  if (!candidates || candidates.length === 0) {
    throw new Error('Gemini did not return any result');
  }

  const content = candidates[0]?.content?.parts?.[0]?.text ?? '';

  const match = content.match(/\d+/);
  if (!match) {
    throw new Error('No numeric value found in Gemini response');
  }

  return parseInt(match[0], 10);
}
