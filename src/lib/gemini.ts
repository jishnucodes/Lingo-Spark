import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

// Instantiate only if key exists to prevent crashing the Next.js dev server if not yet configured
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateQuizFromWords(words: { term: string; definition: string; translation: string | null }[]) {
  if (!ai) throw new Error("Gemini API key tracking is not configured in .env");

  const prompt = `
    You are an expert vocabulary teacher. I will provide you with a list of vocabulary words.
    Please generate a 5-question multiple choice quiz using these words to test the student.
    
    Words:
    ${JSON.stringify(words, null, 2)}
    
    Return the output STRICTLY as a JSON array of objects. 
    Each object must have the following structure:
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "wordTested": "string"
    }
    
    Ensure the distractors (incorrect options) are plausible but incorrect.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
