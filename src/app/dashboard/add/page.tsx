"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddWordPage() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, definition, translation }),
      });

      if (res.ok) {
        toast.success("Word added successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to add word. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!term) {
      toast.warning("Please enter a term to translate first.");
      return;
    }
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: term, targetLanguage: "malayalam" }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslation(data.translation);
        toast.success("Translation added!");
      } else {
        const err = await res.text();
        toast.error(`Translation failed: ${err}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error calling translation service.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add a new word</h1>
        <p className="text-gray-500 text-sm mt-1">Enhance your vocabulary by saving a new word.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="term" className="block text-sm font-medium mb-1">
            Word / Term <span className="text-red-500">*</span>
          </label>
          <input
            id="term"
            required
            type="text"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. Ephemeral"
          />
        </div>

        <div>
          <label htmlFor="definition" className="block text-sm font-medium mb-1">
            Definition <span className="text-red-500">*</span>
          </label>
          <textarea
            id="definition"
            required
            rows={3}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Lasting for a very short time."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="translation" className="block text-sm font-medium">
              Translation (Optional)
            </label>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleTranslate}
              disabled={isTranslating || !term}
              className="h-6 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
            >
              {isTranslating ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Languages className="w-3 h-3 mr-1" />
              )}
              {isTranslating ? "Translating..." : "Auto Translate"}
            </Button>
          </div>
          <input
            id="translation"
            type="text"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="e.g. Éphémère (French)"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Link href="/dashboard">
            <Button variant="outline" type="button" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Word"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
