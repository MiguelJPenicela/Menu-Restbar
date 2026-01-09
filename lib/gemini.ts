
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image from a text prompt using the Gemini API.
 * @param prompt The text prompt to generate the image from.
 * @returns A promise that resolves to the base64 encoded image data.
 */
export async function generateImageFromPrompt(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error('Nenhuma imagem foi gerada. A resposta pode ter sido bloqueada.');

  } catch (error) {
    console.error("Erro na API Gemini:", error);
    throw new Error('Falha ao se comunicar com a API de geração de imagem.');
  }
}
