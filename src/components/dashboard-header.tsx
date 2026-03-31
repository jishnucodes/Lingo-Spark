"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function DashboardHeader({ user }: { user: { name?: string | null; email?: string | null } }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur">
        <div className="container mx-auto flex min-h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            LingoSpark
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              My Words
            </Link>
            <Link href="/dashboard/quiz" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              Quiz Mode
            </Link>
          </nav>

          {/* Right side Actions & Hamburger */}
          <div className="flex items-center gap-4">
             <span className="hidden sm:inline-block text-sm text-gray-500 font-medium max-w-[150px] md:max-w-xs truncate">
               {user.name || user.email}
             </span>
             <Link href="/api/auth/signout" className="hidden md:block">
               <Button variant="outline" size="sm">Sign Out</Button>
             </Link>
             
             {/* Mobile Menu Toggle */}
             <button title="Toggle menu" className="md:hidden flex items-center p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
             </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 animate-in slide-in-from-top-2 duration-200">
            <nav className="container mx-auto flex flex-col p-4 gap-2">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-base font-medium hover:text-indigo-600 transition-colors p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent">
                My Words
              </Link>
              <Link href="/dashboard/quiz" onClick={() => setIsMenuOpen(false)} className="text-base font-medium hover:text-indigo-600 transition-colors p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent">
                Quiz Mode
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/api/auth/signout" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Sign Out</Button>
                  </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
  );
}
