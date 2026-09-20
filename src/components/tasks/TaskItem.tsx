"use client";

import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
}: TaskItemProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(task.id)}
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:bg-slate-800"
    >

      {/* Checkbox */}

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? "border-white bg-white text-slate-950"
            : "border-slate-600"
        }`}
      >

        {task.completed && (
          <span className="text-sm font-bold">
            ✓
          </span>
        )}

      </div>

      {/* Task */}

      <div className="min-w-0 flex-1">

        <p
          className={`font-medium transition ${
            task.completed
              ? "text-slate-500 line-through"
              : "text-white"
          }`}
        >
          {task.title}
        </p>

        <p className="mt-1 text-xs capitalize text-slate-500">
          {task.category}
        </p>

      </div>

      {/* XP */}

      <span className="shrink-0 text-sm font-semibold">
        +{task.xp} XP
      </span>

    </button>
  );
}