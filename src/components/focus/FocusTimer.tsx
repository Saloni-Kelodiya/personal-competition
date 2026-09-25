"use client";

import { useEffect, useState } from "react";

const FOCUS_DURATION = 5 * 60;
const FOCUS_XP = 5;

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          void saveFocusSession();
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const saveFocusSession = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save focus session");
      }

      setMessage("Session saved! +5 XP and +5 focus minutes 🎉");
    } catch (error) {
      console.error("FOCUS SAVE ERROR:", error);
      setMessage(error instanceof Error ? error.message : "Could not save session");
    } finally {
      setIsSaving(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
    setMessage("");
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
          🎯
        </div>

        <h2 className="mt-5 text-2xl font-bold">Focus Session</h2>
        <p className="mt-2 text-sm text-slate-400">Stay focused and make progress.</p>
      </div>

      <div className="mx-auto mt-8 flex h-64 w-64 items-center justify-center rounded-full border-8 border-slate-800 sm:h-72 sm:w-72">
        <div className="text-center">
          <p className="text-6xl font-bold tracking-tight sm:text-7xl">
            {String(minutes).padStart(2, "0")}
            <span className="text-slate-500">:</span>
            {String(seconds).padStart(2, "0")}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {isRunning ? "Stay focused..." : "Ready to focus?"}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-md gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => setIsRunning((running) => !running)}
          className="flex-1 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:opacity-50"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="flex-1 rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-800"
        >
          Reset
        </button>
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-800/70 p-4 text-center">
        <p className="text-sm text-slate-400">Complete this session</p>
        <p className="mt-1 font-semibold">⭐ +{FOCUS_XP} XP • ⏱️ +5 minutes</p>
        {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      </div>
    </div>
  );
}
