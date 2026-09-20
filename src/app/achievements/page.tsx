"use client";

import { useEffect, useState } from "react";

import AchievementCard from "@/components/achievements/AchievementCard";

import { initialData } from "@/data/initialData";

import {
  getStoredData,
} from "@/lib/storage";

import { AppData } from "@/types";

export default function AchievementsPage() {
  const [data, setData] =
    useState<AppData>(initialData);

  const [loaded, setLoaded] =
    useState(false);

 useEffect(() => {
  const storedData = getStoredData();

  queueMicrotask(() => {
    setData(storedData);
    setLoaded(true);
  });
}, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading achievements...
        </p>
      </main>
    );
  }

  const unlockedCount =
    data.achievements.filter(
      (achievement) =>
        achievement.unlocked
    ).length;

  const totalCount =
    data.achievements.length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Header */}

        <header className="mb-8">

          <p className="text-sm text-slate-400">
            Every milestone matters.
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Achievements
          </h1>

          <p className="mt-2 text-slate-400">
            {unlockedCount} of {totalCount} unlocked
          </p>

        </header>

        {/* Progress */}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold">
                Achievement Progress
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Keep improving yourself.
              </p>

            </div>

            <span className="text-2xl font-bold">
              {totalCount === 0
                ? 0
                : Math.round(
                    (unlockedCount /
                      totalCount) *
                      100
                  )}
              %
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${
                  totalCount === 0
                    ? 0
                    : (unlockedCount /
                        totalCount) *
                      100
                }%`,
              }}
            />

          </div>

        </section>

        {/* Achievements */}

        {data.achievements.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center">

            <p className="text-slate-400">
              No achievements available yet.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2">

            {data.achievements.map(
              (achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}