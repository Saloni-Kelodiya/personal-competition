"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import TodayTasks from "@/components/dashboard/TodayTasks";
import GoalOverview from "@/components/dashboard/GoalOverview";
import FocusOverview from "@/components/dashboard/FocusOverview";
import CareerOverview from "@/components/dashboard/CareerOverview";
import { initialData } from "@/data/initialData";
import { AppData } from "@/types";

type CareerItem = { category?: string; skill?: string; progress: number; target: number };

export default function DashboardPage() {
  const [data, setData] = useState<AppData>(initialData);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store", credentials: "include" });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Dashboard API failed");

        const dashboard = result.data;
        const careerData: CareerItem[] = dashboard.career || [];
        const codingMinutes = careerData.filter((item) => item.category === "coding").reduce((total, item) => total + item.progress, 0);
        const projectsCompleted = careerData.filter((item) => item.category === "projects").reduce((total, item) => total + item.progress, 0);
        const skillsImproved = careerData.filter((item) => item.category === "skills").reduce((total, item) => total + item.progress, 0);

        setData({
          ...initialData,
          stats: {
            ...initialData.stats,
            ...dashboard.stats,
          },
          goals: dashboard.goals || [],
          tasks: dashboard.recentTasks || [],
          career: { codingMinutes, projectsCompleted, skillsImproved },
        });
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoaded(true);
      }
    }
    void loadDashboard();
  }, []);

  if (!loaded) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><p className="text-slate-400">Loading dashboard...</p></main>;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = data.tasks.filter((task) => task.date === today);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Your personal competition</p>
          <h1 className="mt-1 text-3xl font-bold">Let's beat yesterday. 👋</h1>
          <p className="mt-2 text-slate-400">Focus on becoming 1% better today.</p>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total XP" value={data.stats.xp} subtitle="Keep earning" icon="⚡" />
          <StatsCard title="Level" value={data.stats.level} subtitle="Your current level" icon="🎮" />
          <StatsCard title="Current Streak" value={data.stats.currentStreak} subtitle="Days in a row" icon="🔥" />
          <StatsCard title="Focus Time" value={`${data.stats.totalFocusMinutes}m`} subtitle="Total focused time" icon="⏱️" />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <TodayTasks tasks={todayTasks} />
          <GoalOverview goals={data.goals} />
        </section>

        <section className="mt-6"><FocusOverview totalMinutes={data.stats.totalFocusMinutes} /></section>
        <div className="mt-6"><CareerOverview codingMinutes={data.career.codingMinutes} projectsCompleted={data.career.projectsCompleted} skillsImproved={data.career.skillsImproved} /></div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center">
          <p className="text-lg font-semibold">"You don't need to beat everyone."</p>
          <p className="mt-2 text-sm text-slate-500">Just beat the version of yourself from yesterday.</p>
        </section>
      </div>
    </main>
  );
}
