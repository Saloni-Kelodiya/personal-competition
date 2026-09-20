"use client";

import FocusTimer from "@/components/focus/FocusTimer";

export default function FocusPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-400">
            Focus
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Focus Mode 🎯
          </h1>

          <p className="mt-2 text-slate-400">
            Focus on one thing. Make progress.
          </p>
        </div>

        {/* Timer */}
        <FocusTimer />

        {/* Tips */}
        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">
            Focus Tips 💡
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>• Keep your phone away.</li>
            <li>• Work on only one task.</li>
            <li>• Avoid unnecessary notifications.</li>
            <li>• Take a short break after the session.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}