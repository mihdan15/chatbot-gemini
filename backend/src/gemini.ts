import { GoogleGenAI, ApiError } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY/GEMINI_API_KEY in project/.env");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generate(prompt: string): Promise<string> {
  try {
    // 🧠 Tambahan konteks agar jadi chatbot general asisten
    const systemPrompt = `
Kamu adalah chatbot asisten AI yang ramah dan sopan.
Gunakan bahasa Indonesia yang alami dan mudah dipahami.
Jawab pertanyaan pengguna secara singkat, jelas, dan relevan.
Jika tidak tahu, jawab dengan jujur tanpa bertele-tele.
`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\nAsisten:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      config: {
        temperature: 0.7,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Model tidak menghasilkan respons teks.");
    }

    return text;
  } catch (err: any) {
    if (err instanceof ApiError) {
      console.error("Gemini ApiError:", {
        status: err.status,
        message: err.message,
      });
      throw new Error(`Gemini error (${err.status}): ${err.message}`);
    }
    console.error("Gemini unknown error:", err);
    throw new Error("Gagal menghasilkan konten dari model AI.");
  }
}
