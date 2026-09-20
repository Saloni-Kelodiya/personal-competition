"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "🏠",
  },
  {
    name: "Goals",
    href: "/goals",
    icon: "🎯",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: "✓",
  },
  {
    name: "Progress",
    href: "/progress",
    icon: "📈",
  },
  {
    name: "Achievements",
    href: "/achievements",
    icon: "🏆",
  },
  {
    name: "English",
    href: "/english",
    icon: "🇬🇧",
  },
  {
    name: "Career",
    href: "/career",
    icon: "💼",
  },
  {
    name: "Focus",
    href: "/focus",
    icon: "⏱️",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 md:block">

      <div className="flex h-full flex-col p-5">

        {/* Logo */}

        <div className="mb-8">

          <h1 className="text-xl font-bold">
            🏆 Personal Competition
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Compete with yourself.
          </p>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2">

          {navigation.map((item) => {

            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </Link>
            );
          })}

        </nav>

        {/* Footer */}

        <div className="border-t border-slate-800 pt-4">

          <p className="text-xs text-slate-600">
            Your only competition is
            yesterdays you.
          </p>

        </div>

      </div>

    </aside>
  );
}