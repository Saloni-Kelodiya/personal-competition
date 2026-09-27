"use client";

import { useEffect, useState } from "react";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import { TaskCategory } from "@/types";

type Goal = {
  id: number;
  title: string;
  description?: string | null;
  category: TaskCategory;
  progress: number;
  target: number;
  deadline?: string | null;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGoals() {
      try {
        const response = await fetch("/api/goals", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Failed to load goals");
        setGoals(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load goals");
      } finally {
        setLoaded(true);
      }
    }
    void loadGoals();
  }, []);

  const handleAddGoal = async (
    title: string,
    description: string,
    category: TaskCategory,
    target: number,
    deadline: string
  ) => {
    setError("");
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, target, deadline }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to create goal");
      setGoals((previous) => [result.data, ...previous]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
    }
  };

  const handleUpdateProgress = async (goalId: string, amount: number) => {
    const goal = goals.find((item) => String(item.id) === goalId);
    if (!goal) return;

    const progress = Math.min(goal.target, Math.max(0, goal.progress + amount));
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to update goal");
      setGoals((previous) => previous.map((item) => item.id === goal.id ? result.data : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal");
    }
  };

  if (!loaded) return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><p className="text-slate-400">Loading goals...</p></main>;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Think bigger. Work smaller.</p>
          <h1 className="mt-1 text-3xl font-bold">My Goals</h1>
          <p className="mt-2 text-slate-400">Your long-term objectives and progress.</p>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </header>

        <GoalForm onAddGoal={handleAddGoal} />

        <section className="mt-8">
          <div className="mb-5"><h2 className="text-xl font-bold">Your Goals</h2><p className="text-sm text-slate-400">Keep moving forward.</p></div>
          {goals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center"><p className="text-slate-400">No goals yet.</p></div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={{ ...goal, id: String(goal.id) }} onUpdateProgress={handleUpdateProgress} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
