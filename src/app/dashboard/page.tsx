import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteWordButton from "@/components/ui/delete-word-button";

async function WordsList({ userId }: { userId: string }) {
  const words = await prisma.word.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (words.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">You haven't added any words yet.</p>
        <Link href="/dashboard/add">
          <Button size="lg">Add your first word</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {words.map((word) => (
        <div key={word.id} className="relative p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <Link href={`/dashboard/edit/${word.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-colors">
                <Pencil className="w-4 h-4" />
              </Button>
            </Link>
            <DeleteWordButton id={word.id} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400 pr-16 line-clamp-1">{word.term}</h3>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-1 line-clamp-3">{word.definition}</p>
          {word.translation && (
            <p className="text-sm text-gray-500 italic mt-2">"{word.translation}"</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex justify-between">
            <span>Repetitions: {word.repetitions}</span>
            <span>Next review: {new Date(word.nextReviewDate).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vocabulary List</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and review your saved words.</p>
        </div>
        <Link href="/dashboard/add">
          <Button className="shadow-md">+ Add Word</Button>
        </Link>
      </div>
      
      <Suspense fallback={<div className="text-center py-10 animate-pulse text-gray-500 text-lg">Loading your words...</div>}>
        <WordsList userId={session.user.id} />
      </Suspense>
    </div>
  );
}
