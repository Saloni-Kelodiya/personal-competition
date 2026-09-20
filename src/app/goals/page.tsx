"use client";

import { useEffect, useState } from "react";

import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";

import { initialData } from "@/data/initialData";

import {
  getStoredData,
  saveData,
} from "@/lib/storage";

import {
  AppData,
  TaskCategory,
} from "@/types";

export default function GoalsPage() {
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

  // Add Goal

  const handleAddGoal = (
    title: string,
    description: string,
    category: TaskCategory,
    target: number,
    deadline: string
  ) => {
    const newGoal = {
      id: `goal-${Date.now()}`,

      title,

      description:
        description || undefined,

      category,

      progress: 0,

      target,

      deadline:
        deadline || undefined,
    };

    setData((previous) => ({
      ...previous,

      goals: [
        ...previous.goals,
        newGoal,
      ],
    }));
  };

  const handleUpdateProgress = (
  goalId: string,
  amount: number
) => {
  setData((previous) => ({
    ...previous,

    goals: previous.goals.map((goal) => {
      if (goal.id !== goalId) {
        return goal;
      }

      const newProgress = Math.min(
        goal.target,
        Math.max(
          0,
          goal.progress + amount
        )
      );

      return {
        ...goal,
        progress: newProgress,
      };
    }),
  }));
};
  // Loading

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading goals...
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
            Think bigger. Work smaller.
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            My Goals
          </h1>

          <p className="mt-2 text-slate-400">
            Your long-term objectives and progress.
          </p>

        </header>

        {/* Goal Form */}

        <GoalForm
          onAddGoal={handleAddGoal}
        />

        {/* Goals */}

        <section>

          <div className="mb-5">

            <h2 className="text-xl font-bold">
              Your Goals
            </h2>

            <p className="text-sm text-slate-400">
              Keep moving forward.
            </p>

          </div>

          {data.goals.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center">

              <p className="text-slate-400">
                No goals yet.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2">

              {data.goals.map((goal) => (
                <GoalCard
  key={goal.id}
  goal={goal}
  onUpdateProgress={handleUpdateProgress}
/>
              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}