import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";

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
      <DashboardHeader
        user={{ name: session.user.name, email: session.user.email }}
      />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
