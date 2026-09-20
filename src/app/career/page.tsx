"use client";

import { useEffect, useState } from "react";
import CareerCard from "@/components/career/CareerCard";
import { getStoredData, saveData } from "@/lib/storage";

export default function CareerPage() {
  const [data, setData] = useState<ReturnType<typeof getStoredData> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedData = getStoredData();

    queueMicrotask(() => {
      setData(storedData);
      setLoaded(true);
    });
  }, []);

  const updateCareerStat = (
    key: keyof ReturnType<typeof getStoredData>["career"],
    amount: number
  ) => {
    setData((currentData) => {
      if (!currentData) return currentData;

      const updatedData = {
        ...currentData,
        career: {
          ...currentData.career,
          [key]: Math.max(
            0,
            currentData.career[key] + amount
          ),
        },
      };

      saveData(updatedData);

      return updatedData;
    });
  };

  if (!loaded || !data) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8">
          <p className="text-sm text-slate-400">
            Career Tracker
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Build Your Career 🚀
          </h1>

          <p className="mt-2 text-slate-400">
            Track your coding, projects and skill growth.
          </p>
        </div>

        {/* Career Cards */}

        <div className="grid gap-5 md:grid-cols-3">

          <CareerCard
            title="Coding Time"
            value={data.career.codingMinutes}
            unit="minutes"
            icon="💻"
            step={15}
            onUpdate={(amount) =>
              updateCareerStat("codingMinutes", amount)
            }
          />

          <CareerCard
            title="Projects Completed"
            value={data.career.projectsCompleted}
            unit="projects"
            icon="🚀"
            step={1}
            onUpdate={(amount) =>
              updateCareerStat("projectsCompleted", amount)
            }
          />

          <CareerCard
            title="Skills Improved"
            value={data.career.skillsImproved}
            unit="skills"
            icon="🧠"
            step={1}
            onUpdate={(amount) =>
              updateCareerStat("skillsImproved", amount)
            }
          />

        </div>

        {/* Summary */}

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-semibold">
            Career Summary
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Coding
              </p>
              <p className="mt-1 text-2xl font-bold">
                {data.career.codingMinutes} min
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Projects
              </p>
              <p className="mt-1 text-2xl font-bold">
                {data.career.projectsCompleted}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Skills
              </p>
              <p className="mt-1 text-2xl font-bold">
                {data.career.skillsImproved}
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}