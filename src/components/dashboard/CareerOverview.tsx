"use client";

interface CareerOverviewProps {
  codingMinutes: number;
  projectsCompleted: number;
  skillsImproved: number;
}

export default function CareerOverview({
  codingMinutes,
  projectsCompleted,
  skillsImproved,
}: CareerOverviewProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Career
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Keep Growing 🚀
          </h2>
        </div>

        <span className="text-3xl">💼</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-slate-800 p-4">
          <p className="text-xl">💻</p>

          <p className="mt-2 text-xl font-bold">
            {codingMinutes}
          </p>

          <p className="text-xs text-slate-400">
            Coding min
          </p>
        </div>

        <div className="rounded-2xl bg-slate-800 p-4">
          <p className="text-xl">🚀</p>

          <p className="mt-2 text-xl font-bold">
            {projectsCompleted}
          </p>

          <p className="text-xs text-slate-400">
            Projects
          </p>
        </div>

        <div className="rounded-2xl bg-slate-800 p-4">
          <p className="text-xl">🧠</p>

          <p className="mt-2 text-xl font-bold">
            {skillsImproved}
          </p>

          <p className="text-xs text-slate-400">
            Skills
          </p>
        </div>
      </div>
    </div>
  );
}