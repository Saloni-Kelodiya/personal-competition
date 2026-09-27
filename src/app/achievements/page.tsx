"use client";

import { useEffect, useState } from "react";
import AchievementCard from "@/components/achievements/AchievementCard";
import { initialData } from "@/data/initialData";
import { Achievement, AppData } from "@/types";

export default function AchievementsPage() {
  const [data, setData] = useState<AppData>(initialData);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAchievements() {
      try {
        const response = await fetch("/api/achievements", {
          credentials: "include",
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to load achievements");
        }

        const achievements: Achievement[] = (result.data || []).map((item: any) => ({
          id: String(item.id),
          title: item.title,
          description: item.description,
          icon: item.icon,
          unlocked: item.unlocked,
          unlockedAt: item.unlockedAt ?? undefined,
        }));

        setData((previous) => ({ ...previous, achievements }));
      } catch (err) {
        console.error("ACHIEVEMENTS LOAD ERROR:", err);
        setError(err instanceof Error ? err.message : "Failed to load achievements");
      } finally {
        setLoaded(true);
      }
    }

    void loadAchievements();
  }, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading achievements...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-900 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="mt-2 text-red-400">{error}</p>
        </div>
      </main>
    );
  }

  const unlockedCount = data.achievements.filter((achievement) => achievement.unlocked).length;
  const totalCount = data.achievements.length;
  const progress = totalCount ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Every milestone matters.</p>
          <h1 className="mt-1 text-3xl font-bold">Achievements</h1>
          <p className="mt-2 text-slate-400">{unlockedCount} of {totalCount} unlocked</p>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Achievement Progress</h2>
              <p className="mt-1 text-sm text-slate-400">Keep improving yourself.</p>
            </div>
            <span className="text-2xl font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
        </section>

        {totalCount === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-slate-400">No achievements available yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {data.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
