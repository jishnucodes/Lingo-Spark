import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateQuizFromWords } from "@/lib/gemini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Select all words ready for review or newest
    const words = await prisma.word.findMany({
      where: { userId: session.user.id },
      orderBy: { nextReviewDate: "asc" },
      take: 20
    });

    if (words.length < 5) {
      return new NextResponse("Not enough words to generate a quiz. Add at least 5 words to your dictionary.", { status: 400 });
    }

    // Shuffle and pick 5 to test
    const selected = words.sort(() => 0.5 - Math.random()).slice(0, 5);

    const quizData = await generateQuizFromWords(
      selected.map(w => ({ term: w.term, definition: w.definition, translation: w.translation }))
    );

    return NextResponse.json(quizData);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return new NextResponse(error.message || "Failed to generate quiz", { status: 500 });
  }
}
