import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditWordForm from "@/components/ui/edit-word-form";

export default async function EditWordPage({ params }: { params: Promise<{ id: string }> } | { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  // Handle Next 15+ promise params securely
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const word = await prisma.word.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!word) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Word</h1>
        <p className="text-gray-500 text-sm mt-1">Update the details of your saved word.</p>
      </div>
      <EditWordForm word={word} />
    </div>
  );
}
