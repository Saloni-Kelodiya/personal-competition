"use client";

import { Goal } from "@/types";

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (
    goalId: string,
    amount: number
  ) => void;
}

export default function GoalCard({
  goal,
  onUpdateProgress,
}: GoalCardProps) {
  const percentage = Math.min(
    100,
    Math.round(
      (goal.progress / goal.target) * 100
    )
  );

  const isCompleted = percentage >= 100;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="text-lg font-bold">
            {goal.title}
          </h3>

          {goal.description && (
            <p className="mt-1 text-sm text-slate-400">
              {goal.description}
            </p>
          )}
        </div>

        <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">
          {goal.category}
        </span>

      </div>

      {/* Progress */}

      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-sm text-slate-400">
            Progress
          </span>

          <span className="text-sm font-semibold">
            {percentage}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

      {/* Completed */}

      {isCompleted && (
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-3 text-center">
          🏆 Goal Completed!
        </div>
      )}

      {/* Controls */}

      {!isCompleted && (
        <div className="mt-5 flex gap-3">

          <button
            type="button"
            onClick={() =>
              onUpdateProgress(
                goal.id,
                -10
              )
            }
            disabled={goal.progress <= 0}
            className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −10
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateProgress(
                goal.id,
                10
              )
            }
            disabled={goal.progress >= goal.target}
            className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +10
          </button>

        </div>
      )}

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between text-sm">

        <span className="text-slate-500">
          Progress: {goal.progress} / {goal.target}
        </span>

        {goal.deadline && (
          <span className="text-slate-400">
            Due: {goal.deadline}
          </span>
        )}

      </div>

    </div>
  );
}