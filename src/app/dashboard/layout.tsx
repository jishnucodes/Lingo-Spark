import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            LingoSpark
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              My Words
            </Link>
            <Link href="/dashboard/quiz" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              Quiz Mode
            </Link>
          </nav>
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-500 font-medium">
               {session.user.name || session.user.email}
             </span>
             <Link href="/api/auth/signout">
               <Button variant="outline" size="sm">Sign Out</Button>
             </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
