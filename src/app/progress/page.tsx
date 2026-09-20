"use client";

import { useEffect, useState } from "react";

import {
  getStoredData,
} from "@/lib/storage";

import { AppData } from "@/types";

export default function ProgressPage() {
  const [data, setData] =
    useState<AppData | null>(null);

  useEffect(() => {
  const storedData = getStoredData();

  queueMicrotask(() => {
    setData(storedData);
  });
}, []);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading progress...
        </p>
      </main>
    );
  }

  const totalTasks = data.tasks.length;

  const completedTasks =
    data.tasks.filter(
      (task) => task.completed
    ).length;

  const taskPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const totalGoals = data.goals.length;

  const completedGoals =
    data.goals.filter(
      (goal) =>
        goal.progress >= goal.target
    ).length;

  const averageGoalProgress =
    totalGoals === 0
      ? 0
      : Math.round(
          data.goals.reduce(
            (total, goal) =>
              total +
              Math.min(
                100,
                (goal.progress /
                  goal.target) *
                  100
              ),
            0
          ) / totalGoals
        );

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Header */}

        <header className="mb-8">

          <p className="text-sm text-slate-400">
            See how far you've come.
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            My Progress
          </h1>

          <p className="mt-2 text-slate-400">
            Your personal competition dashboard.
          </p>

        </header>

        {/* Stats */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* XP */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Total XP
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.stats.xp}
            </p>

          </div>

          {/* Level */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Level
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.stats.level}
            </p>

          </div>

          {/* Streak */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Current Streak
            </p>

            <p className="mt-2 text-3xl font-bold">
              🔥 {data.stats.currentStreak}
            </p>

          </div>

          {/* Focus */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Focus Time
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.stats.totalFocusMinutes}
              <span className="ml-1 text-sm text-slate-400">
                min
              </span>
            </p>

          </div>

        </div>

        {/* Tasks Progress */}

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {completedTasks} of{" "}
                {totalTasks} tasks completed
              </p>

            </div>

            <span className="text-2xl font-bold">
              {taskPercentage}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${taskPercentage}%`,
              }}
            />

          </div>

        </section>

        {/* Goals Progress */}

        <section className="mt-5 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Goals
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {completedGoals} of{" "}
                {totalGoals} goals completed
              </p>

            </div>

            <span className="text-2xl font-bold">
              {averageGoalProgress}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${averageGoalProgress}%`,
              }}
            />

          </div>

        </section>

        {/* Streak */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Current Streak
            </p>

            <p className="mt-2 text-4xl font-bold">
              🔥 {data.stats.currentStreak}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Keep showing up.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Longest Streak
            </p>

            <p className="mt-2 text-4xl font-bold">
              🏆 {data.stats.longestStreak}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Your personal best.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}