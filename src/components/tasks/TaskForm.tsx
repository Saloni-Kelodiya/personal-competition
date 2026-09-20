"use client";

import { FormEvent, useState } from "react";
import { TaskCategory } from "@/types";

interface TaskFormProps {
  onAddTask: (
    title: string,
    category: TaskCategory,
    xp: number
  ) => void;
}

export default function TaskForm({
  onAddTask,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<TaskCategory>("career");
  const [xp, setXp] = useState(20);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAddTask(trimmedTitle, category, xp);

    setTitle("");
    setCategory("career");
    setXp(20);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
    >
      <h2 className="text-xl font-bold">
        Add New Task
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Add something you want to accomplish today.
      </p>

      {/* Title */}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Task
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="e.g. Practice JavaScript"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-400"
        />
      </div>

      {/* Category */}

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value as TaskCategory
            )
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        >
          <option value="career">
            Career
          </option>

          <option value="english">
            English
          </option>

          <option value="health">
            Health
          </option>

          <option value="learning">
            Learning
          </option>

          <option value="personal">
            Personal
          </option>
        </select>
      </div>

      {/* XP */}

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          XP Reward
        </label>

        <select
          value={xp}
          onChange={(event) =>
            setXp(Number(event.target.value))
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        >
          <option value={5}>5 XP — Easy</option>
          <option value={10}>10 XP — Small</option>
          <option value={15}>15 XP — Medium</option>
          <option value={20}>20 XP — Normal</option>
          <option value={30}>30 XP — Hard</option>
          <option value={50}>50 XP — Major</option>
        </select>
      </div>

      {/* Submit */}

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Add Task
      </button>
    </form>
  );
}