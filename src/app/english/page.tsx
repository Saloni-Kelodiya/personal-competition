"use client";

import { useEffect, useState } from "react";
import EnglishCard from "@/components/english/EnglishCard";

type EnglishStats = {
  speakingMinutes: number;
  vocabularyLearned: number;
  readingMinutes: number;
  listeningMinutes: number;
};

const initialStats: EnglishStats = {
  speakingMinutes: 0,
  vocabularyLearned: 0,
  readingMinutes: 0,
  listeningMinutes: 0,
};

const activityMap = {
  speakingMinutes: "speaking",
  vocabularyLearned: "vocabulary",
  readingMinutes: "reading",
  listeningMinutes: "listening",
} as const;

export default function EnglishPage() {
  const [data, setData] = useState<EnglishStats>(initialStats);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/english", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Failed to load English progress");

        const stats = { ...initialStats };
        for (const record of result.data || []) {
          const minutes = Number(record.minutes) || 0;
          if (record.activity === "speaking") stats.speakingMinutes += minutes;
          if (record.activity === "vocabulary") stats.vocabularyLearned += minutes;
          if (record.activity === "reading") stats.readingMinutes += minutes;
          if (record.activity === "listening") stats.listeningMinutes += minutes;
        }
        setData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load English progress");
      } finally {
        setLoaded(true);
      }
    }
    void load();
  }, []);

  const updateEnglishStat = async (
    field: keyof EnglishStats,
    amount: number
  ) => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/english", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity: activityMap[field], minutes: amount }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to save progress");
      setData((previous) => ({ ...previous, [field]: previous[field] + amount }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><p className="text-slate-400">Loading English tracker...</p></main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Improve a little every day.</p>
          <h1 className="mt-1 text-3xl font-bold">English Progress 🇬🇧</h1>
          <p className="mt-2 text-slate-400">Track the time and effort you put into improving your English.</p>
          {saving && <p className="mt-2 text-sm text-slate-500">Saving...</p>}
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <EnglishCard title="Speaking" value={data.speakingMinutes} unit="minutes" icon="🎤" step={10} onUpdate={(amount) => void updateEnglishStat("speakingMinutes", amount)} />
          <EnglishCard title="Vocabulary" value={data.vocabularyLearned} unit="words" icon="📚" step={5} onUpdate={(amount) => void updateEnglishStat("vocabularyLearned", amount)} />
          <EnglishCard title="Reading" value={data.readingMinutes} unit="minutes" icon="📖" step={10} onUpdate={(amount) => void updateEnglishStat("readingMinutes", amount)} />
          <EnglishCard title="Listening" value={data.listeningMinutes} unit="minutes" icon="🎧" step={10} onUpdate={(amount) => void updateEnglishStat("listeningMinutes", amount)} />
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Your English Journey</h2>
          <p className="mt-2 text-sm text-slate-400">Consistency matters more than perfection. Keep building your skills every day.</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div><p className="text-2xl font-bold">{data.speakingMinutes}</p><p className="text-xs text-slate-500">Speaking min</p></div>
            <div><p className="text-2xl font-bold">{data.vocabularyLearned}</p><p className="text-xs text-slate-500">Words</p></div>
            <div><p className="text-2xl font-bold">{data.readingMinutes}</p><p className="text-xs text-slate-500">Reading min</p></div>
            <div><p className="text-2xl font-bold">{data.listeningMinutes}</p><p className="text-xs text-slate-500">Listening min</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
