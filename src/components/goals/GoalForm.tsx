"use client";

import { FormEvent, useState } from "react";
import { TaskCategory } from "@/types";

interface GoalFormProps {
  onAddGoal: (
    title: string,
    description: string,
    category: TaskCategory,
    target: number,
    deadline: string
  ) => void;
}

export default function GoalForm({
  onAddGoal,
}: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState<TaskCategory>("career");
  const [target, setTarget] = useState(100);
  const [deadline, setDeadline] =
    useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) return;

    onAddGoal(
      title.trim(),
      description.trim(),
      category,
      target,
      deadline
    );

    setTitle("");
    setDescription("");
    setCategory("career");
    setTarget(100);
    setDeadline("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6"
    >
      <h2 className="text-xl font-bold">
        Create New Goal
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Set something meaningful you want to achieve.
      </p>

      {/* Title */}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Goal Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="e.g. Become a Full Stack Developer"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
        />
      </div>

      {/* Description */}

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="What do you want to achieve?"
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
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

      {/* Target */}

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          Target
        </label>

        <input
          type="number"
          min={1}
          value={target}
          onChange={(event) =>
            setTarget(
              Number(event.target.value)
            )
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400"
        />

        <p className="mt-1 text-xs text-slate-500">
          Progress will start from 0.
        </p>
      </div>

      {/* Deadline */}

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          Deadline
        </label>

        <input
          type="date"
          value={deadline}
          onChange={(event) =>
            setDeadline(event.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        />
      </div>

      {/* Button */}

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200"
      >
        Create Goal
      </button>
    </form>
  );
}