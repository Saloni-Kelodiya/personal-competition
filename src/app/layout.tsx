import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "Personal Competition",
  description:
    "Compete with yourself. Become better every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <div className="min-h-screen">

          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="min-h-screen pb-20 md:ml-64 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav />

        </div>
      </body>
    </html>
  );
}