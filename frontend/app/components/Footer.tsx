"use client";

import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`mt-16 py-8 px-6 text-center border-t transition-all ${
        theme === "dark"
          ? "bg-gray-950 text-gray-300 border-gray-700"  // Dark mode
          : "bg-blue-50 text-gray-900 border-blue-200"   // Light mode
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold tracking-wide">SkillMatch</h2>

        <div className="w-12 h-1 bg-blue-500 rounded-full"></div>

        <p className="text-sm opacity-75">
          Connecting students, building projects, and shaping the future.
        </p>

        <p className="text-xs opacity-50">© {new Date().getFullYear()} SkillMatch. All rights reserved.</p>
      </div>
    </footer>
  );
}
