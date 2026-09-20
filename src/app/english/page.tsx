"use client";

import { useEffect, useState } from "react";

import EnglishCard from "@/components/english/EnglishCard";

import { initialData } from "@/data/initialData";

import {
  getStoredData,
  saveData,
} from "@/lib/storage";

import { AppData } from "@/types";

export default function EnglishPage() {
  const [data, setData] =
    useState<AppData>(initialData);

  const [loaded, setLoaded] =
    useState(false);

  // Load saved data

 useEffect(() => {
  const storedData = getStoredData();

  queueMicrotask(() => {
    setData(storedData);
    setLoaded(true);
  });
}, []);

  // Save data

  useEffect(() => {
    if (!loaded) return;

    saveData(data);
  }, [data, loaded]);

  // Update English stats

  const updateEnglishStat = (
    field:
      | "speakingMinutes"
      | "vocabularyLearned"
      | "readingMinutes"
      | "listeningMinutes",
    amount: number
  ) => {
    setData((previous) => ({
      ...previous,

      english: {
        ...previous.english,

        [field]: Math.max(
          0,
          previous.english[field] + amount
        ),
      },
    }));
  };

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading English tracker...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Header */}

        <header className="mb-8">

          <p className="text-sm text-slate-400">
            Improve a little every day.
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            English Progress 🇬🇧
          </h1>

          <p className="mt-2 text-slate-400">
            Track the time and effort you put
            into improving your English.
          </p>

        </header>

        {/* Cards */}

        <div className="grid gap-5 sm:grid-cols-2">

          <EnglishCard
            title="Speaking"
            value={
              data.english.speakingMinutes
            }
            unit="minutes"
            icon="🎤"
            step={10}
            onUpdate={(amount) =>
              updateEnglishStat(
                "speakingMinutes",
                amount
              )
            }
          />

          <EnglishCard
            title="Vocabulary"
            value={
              data.english.vocabularyLearned
            }
            unit="words"
            icon="📚"
            step={5}
            onUpdate={(amount) =>
              updateEnglishStat(
                "vocabularyLearned",
                amount
              )
            }
          />

          <EnglishCard
            title="Reading"
            value={
              data.english.readingMinutes
            }
            unit="minutes"
            icon="📖"
            step={10}
            onUpdate={(amount) =>
              updateEnglishStat(
                "readingMinutes",
                amount
              )
            }
          />

          <EnglishCard
            title="Listening"
            value={
              data.english.listeningMinutes
            }
            unit="minutes"
            icon="🎧"
            step={10}
            onUpdate={(amount) =>
              updateEnglishStat(
                "listeningMinutes",
                amount
              )
            }
          />

        </div>

        {/* Summary */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold">
            Your English Journey
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Consistency matters more than perfection.
            Keep building your skills every day.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

            <div>
              <p className="text-2xl font-bold">
                {data.english.speakingMinutes}
              </p>

              <p className="text-xs text-slate-500">
                Speaking min
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                {data.english.vocabularyLearned}
              </p>

              <p className="text-xs text-slate-500">
                Words
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                {data.english.readingMinutes}
              </p>

              <p className="text-xs text-slate-500">
                Reading min
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                {data.english.listeningMinutes}
              </p>

              <p className="text-xs text-slate-500">
                Listening min
              </p>
            </div>

          </div>

        </section>

      </div>

    </main>
  );
}