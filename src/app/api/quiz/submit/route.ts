import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { score, total, results } = await req.json();
    
    // Save quiz history
    await prisma.quiz.create({
      data: {
        userId: session.user.id,
        score,
        totalWords: total
      }
    });

    // Update SM-2 spaced repetition for each word
    const updates = results.map(async (r: any) => {
      const word = await prisma.word.findFirst({
        where: { term: r.term, userId: session.user.id }
      });
      if (!word) return;

      let { interval, easeFactor, repetitions } = word;
      const isCorrect = r.isCorrect;

      if (isCorrect) {
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetitions += 1;
        easeFactor = easeFactor + 0.1;
      } else {
        repetitions = 0;
        interval = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2); // Don't let ease factor drop below 1.3
      }

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);

      await prisma.word.update({
        where: { id: word.id },
        data: { interval, easeFactor, repetitions, nextReviewDate }
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Quiz submit error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
