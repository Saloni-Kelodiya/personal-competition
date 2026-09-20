"use client";

import Link from "next/link";

interface FocusOverviewProps {
  totalMinutes: number;
}

export default function FocusOverview({
  totalMinutes,
}: FocusOverviewProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            Focus Time
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalMinutes} min
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total focused time
          </p>

        </div>

        <div className="text-4xl">
          ⏱️
        </div>

      </div>

      <Link
        href="/focus"
        className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-slate-200"
      >
        Start Focus
      </Link>

    </section>
  );
}