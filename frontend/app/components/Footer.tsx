"use client";

import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`mt-16 py-8 px-6 text-center border-t transition-all ${
        theme === "dark"
          ? "bg-gray-950 text-gray-300 border-gray-700" 
          : "bg-blue-50 text-gray-900 border-blue-200"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-4">
        <p className="text-xs opacity-50">© {new Date().getFullYear()} SkillMatch. All rights reserved.</p>
      </div>
    </footer>
  );
}
