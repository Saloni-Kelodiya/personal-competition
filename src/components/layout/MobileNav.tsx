"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Home",
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
    name: "More",
    href: "/achievements",
    icon: "🏆",
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur md:hidden">

      <div className="grid grid-cols-5">

        {navigation.map((item) => {

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-3 text-xs ${
                isActive
                  ? "text-white"
                  : "text-slate-500"
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

      </div>

    </nav>
  );
}