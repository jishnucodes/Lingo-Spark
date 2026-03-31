import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ai } from "@/lib/gemini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { text, targetLanguage = "en" } = await req.json();

    if (!text) {
      return new NextResponse("Missing text to translate", { status: 400 });
    }

    if (!ai) {
      return new NextResponse("Gemini API key not configured", { status: 500 });
    }

    const prompt = `Translate the following text to ${targetLanguage}. ONLY return the translated text. Do not include quotes, explanations, or the original text:\n\n${text}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const translatedText = response.text?.trim() || "";

    if (!translatedText) {
      throw new Error("Translation failed");
    }

    return NextResponse.json({ translation: translatedText });
  } catch (error: any) {
    console.error("Translation error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
