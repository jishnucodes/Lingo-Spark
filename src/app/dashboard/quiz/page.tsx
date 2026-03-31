"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  wordTested: string;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<{term: string, isCorrect: boolean}[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // For immediate feedback
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/quiz/generate", { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate quiz");
      }
      const data = await res.json();
      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      setResults([]);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    const currentQ = questions[currentIndex];
    const correct = option === currentQ.correctAnswer;
    
    setSelectedOption(option);
    setIsAnswerCorrect(correct);
    
    if (correct) setScore(s => s + 1);
    
    setResults(prev => [...prev, { term: currentQ.wordTested, isCorrect: correct }]);

    setTimeout(() => {
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finishQuiz([...results, { term: currentQ.wordTested, isCorrect: correct }]);
      }
    }, 1500); // 1.5 second delay
  };

  const finishQuiz = async (finalResults: {term: string, isCorrect: boolean}[]) => {
    setFinished(true);
    setSubmitting(true);
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: finalResults.filter(r => r.isCorrect).length,
          total: questions.length,
          results: finalResults
        })
      });
    } catch (error) {
      console.error("Failed to submit quiz results", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-4">Quiz Mode</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Test your vocabulary and update your spaced-repetition schedule. Our AI will generate dynamic questions based on your saved words to ensure you truly understand them.
        </p>
        
        {errorMsg ? (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg max-w-md text-center border border-red-200">
            {errorMsg}
          </div>
        ) : null}

        <Button size="lg" onClick={startQuiz} disabled={loading} className="px-8 py-6 text-lg rounded-full shadow-md transition-all hover:shadow-lg">
          {loading ? "Generating Quiz with AI..." : "Generate AI Quiz"}
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-500">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-600 dark:text-indigo-400">Quiz Complete!</h1>
        <p className="text-xl mb-8">
          You scored {score} out of {questions.length}
        </p>
        
        {submitting ? (
          <p className="text-sm border border-indigo-100 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg animate-pulse text-indigo-600 dark:text-indigo-400">
            Updating your memory schedule...
          </p>
        ) : (
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setQuestions([])}>Take Another</Button>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6 text-sm text-gray-500 font-medium">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 animate-in slide-in-from-right-4 duration-300">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {currentQ.options.map((option, idx) => {
            let btnClass = "h-auto py-4 px-6 justify-start text-left font-normal items-start flex text-base bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-all";
            
            if (selectedOption !== null) {
              if (option === currentQ.correctAnswer) {
                btnClass = "h-auto py-4 px-6 justify-start text-left font-normal items-start flex text-base bg-green-100 dark:bg-green-900/50 border-green-500 text-green-900 dark:text-green-100 shadow-inner";
              } else if (option === selectedOption) {
                btnClass = "h-auto py-4 px-6 justify-start text-left font-normal items-start flex text-base bg-red-100 dark:bg-red-900/50 border-red-500 text-red-900 dark:text-red-100 shadow-inner";
              } else {
                btnClass = "h-auto py-4 px-6 justify-start text-left font-normal items-start flex text-base bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 opacity-50";
              }
            }

            return (
              <Button
                key={idx}
                variant="outline"
                className={btnClass}
                onClick={() => handleAnswer(option)}
                disabled={selectedOption !== null}
              >
                {option}
              </Button>
            );
          })}
        </div>
        
        {selectedOption !== null && (
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2">
            {isAnswerCorrect ? (
              <span className="text-green-600 dark:text-green-400 font-bold text-lg flex items-center justify-center gap-2">
                <span className="text-2xl">✓</span> Correct!
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-bold text-lg flex items-center justify-center gap-2">
                <span className="text-2xl">✗</span> Incorrect
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
