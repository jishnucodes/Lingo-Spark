import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { term, definition, translation } = await req.json();

    if (!term || !definition) {
      return new NextResponse("Term and definition are required", { status: 400 });
    }

    // In Next.js 15+, params is returned as a Promise
    // But since the setup might be using Next.js 14, we await it safely
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const word = await prisma.word.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        term,
        definition,
        translation: translation || null,
      },
    });

    return NextResponse.json(word);
  } catch (error: any) {
    console.error("Error updating word:", error);
    if (error.code === "P2025") {
      return new NextResponse("Word not found or unauthorized", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await prisma.word.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error: any) {
    console.error("Error deleting word:", error);
    if (error.code === "P2025") {
      return new NextResponse("Word not found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
