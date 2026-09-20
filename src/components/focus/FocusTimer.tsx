"use client";

import { useEffect, useState } from "react";

import { getStoredData, saveData } from "@/lib/storage";
import { addXP } from "@/lib/xp";
import { checkAchievements } from "@/lib/achievements";

const FOCUS_DURATION = 5 * 60;
const FOCUS_XP = 5;

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(timer);
          setIsRunning(false);

          const data = getStoredData();

          // Add XP
          const xpResult = addXP(
            data.stats.xp,
            FOCUS_XP
          );

          // Add focus minutes
          const updatedStats = {
            ...data.stats,
            xp: xpResult.xp,
            level: xpResult.level,
            totalFocusMinutes:
              data.stats.totalFocusMinutes + 5,
          };

          // Check achievements
          const updatedAchievements =
            checkAchievements(
              data.achievements,
              updatedStats
            );

          const updatedData = {
            ...data,
            stats: updatedStats,
            achievements: updatedAchievements,
          };

          saveData(updatedData);

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10">

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
          🎯
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          Focus Session
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Stay focused and make progress.
        </p>
      </div>

      {/* Timer */}
      <div className="mx-auto mt-8 flex h-64 w-64 items-center justify-center rounded-full border-8 border-slate-800 sm:h-72 sm:w-72">
        <div className="text-center">
          <p className="text-6xl font-bold tracking-tight sm:text-7xl">
            {String(minutes).padStart(2, "0")}
            <span className="text-slate-500">:</span>
            {String(seconds).padStart(2, "0")}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            {isRunning
              ? "Stay focused..."
              : "Ready to focus?"}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mx-auto mt-8 flex max-w-md gap-3">
        <button
          type="button"
          onClick={() =>
            setIsRunning((running) => !running)
          }
          className="flex-1 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
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

      {/* Reward */}
      <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-800/70 p-4 text-center">
        <p className="text-sm text-slate-400">
          Complete this session
        </p>

        <p className="mt-1 font-semibold">
          ⭐ +{FOCUS_XP} XP
          {" • "}
          ⏱️ +5 minutes
        </p>
      </div>

    </div>
  );
}