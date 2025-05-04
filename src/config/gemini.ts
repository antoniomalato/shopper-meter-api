import axios from 'axios';
import dotenv from 'dotenv';
import { ImageType } from '../enums/image_type.enum';

dotenv.config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';

const apiKey = process.env.GEMINI_API_KEY;

function detectMimeType(base64Image: string): string {
  let mimeType = 'image/jpeg';

  if (base64Image.startsWith('data:')) {
    const matches = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (matches && matches.length > 1) {
      mimeType = matches[1];
    }
  } else {
    const header = base64Image.substring(0, 8);

    if (header.startsWith('/9j/')) {
      mimeType = ImageType.JPEG;
    } else if (header.startsWith('iVBORw0')) {
      mimeType = ImageType.PNG;
    } else if (header.startsWith('R0lGODlh')) {
      mimeType = ImageType.GIF;
    } else if (header.startsWith('UklGR')) {
      mimeType = ImageType.WEBP;
    }
  }

  return mimeType;
}

export async function getMeasureFromImage(base64Image: string): Promise<number> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment');
  }

  try {
    console.log('Fazendo requisição para a API do Gemini...');

    let imageData = base64Image;
    let mimeType = detectMimeType(base64Image);

    if (base64Image.startsWith('data:')) {
      imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    }

    console.log(mimeType);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Leia o número de um medidor de água ou gás e retorne apenas o valor numérico, sem nenhuma explicação.",
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageData,
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
  } catch (error: any) {
    console.error('Erro ao chamar a API do Gemini:', error.message);
    throw new Error('Failed to get measure from image');
  }
}
