"use client";

import { useEffect, useState } from "react";
import CareerCard from "@/components/career/CareerCard";

type CareerStats = {
  codingMinutes: number;
  projectsCompleted: number;
  skillsImproved: number;
};

const initialStats: CareerStats = { codingMinutes: 0, projectsCompleted: 0, skillsImproved: 0 };

export default function CareerPage() {
  const [data, setData] = useState<CareerStats>(initialStats);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/career", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Failed to load career progress");

        const stats = { ...initialStats };
        for (const record of result.data || []) {
          const amount = Number(record.progress) || 0;
          if (record.category === "coding") stats.codingMinutes += amount;
          if (record.category === "projects") stats.projectsCompleted += amount;
          if (record.category === "skills") stats.skillsImproved += amount;
        }
        setData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load career progress");
      } finally {
        setLoaded(true);
      }
    }
    void load();
  }, []);

  const updateCareerStat = async (key: keyof CareerStats, amount: number) => {
    const category = key === "codingMinutes" ? "coding" : key === "projectsCompleted" ? "projects" : "skills";
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: key, category, amount }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to save career progress");
      setData((previous) => ({ ...previous, [key]: previous[key] + amount }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save career progress");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <main className="min-h-screen bg-slate-950 p-6 text-white">Loading...</main>;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm text-slate-400">Career Tracker</p>
          <h1 className="mt-1 text-3xl font-bold">Build Your Career 🚀</h1>
          <p className="mt-2 text-slate-400">Track your coding, projects and skill growth.</p>
          {saving && <p className="mt-2 text-sm text-slate-500">Saving...</p>}
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <CareerCard title="Coding Time" value={data.codingMinutes} unit="minutes" icon="💻" step={15} onUpdate={(amount) => void updateCareerStat("codingMinutes", amount)} />
          <CareerCard title="Projects Completed" value={data.projectsCompleted} unit="projects" icon="🚀" step={1} onUpdate={(amount) => void updateCareerStat("projectsCompleted", amount)} />
          <CareerCard title="Skills Improved" value={data.skillsImproved} unit="skills" icon="🧠" step={1} onUpdate={(amount) => void updateCareerStat("skillsImproved", amount)} />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Career Summary</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-800 p-4"><p className="text-sm text-slate-400">Coding</p><p className="mt-1 text-2xl font-bold">{data.codingMinutes} min</p></div>
            <div className="rounded-2xl bg-slate-800 p-4"><p className="text-sm text-slate-400">Projects</p><p className="mt-1 text-2xl font-bold">{data.projectsCompleted}</p></div>
            <div className="rounded-2xl bg-slate-800 p-4"><p className="text-sm text-slate-400">Skills</p><p className="mt-1 text-2xl font-bold">{data.skillsImproved}</p></div>
          </div>
        </div>
      </div>
    </main>
  );
}
