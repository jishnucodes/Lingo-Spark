import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const words = await prisma.word.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(words);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { term, definition, translation } = await req.json();

  if (!term || !definition) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const word = await prisma.word.create({
    data: {
      term,
      definition,
      translation,
      userId: session.user.id
    }
  });

  return NextResponse.json(word);
}
