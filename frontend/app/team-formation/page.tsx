"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Team = {
  _id: string;
  name: string;
  category: string;
  role: string;
  createdAt: string;
};

export default function TeamsDashboard() {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`);
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const currentTheme = mounted ? (theme === "system" ? systemTheme || "light" : theme) : "light";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`min-h-screen p-6 transition-colors ${currentTheme === "dark" ? "bg-black text-white" : "text-black"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left w-full sm:w-auto">
          Teams Dashboard
        </h1>

        <Button
          onClick={() => router.push("/team/create-team")}
          className="w-full sm:w-auto my-3">
          Create Team
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link key={team._id} href={`/team/${team._id}`}>
            <div className={`p-4 rounded-lg shadow-md flex items-center space-x-4 transition-all cursor-pointer hover:shadow-lg 
              ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>

              <div className={`w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-xl font-bold 
                ${currentTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}>
                {team.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-semibold">{team.name}</h2>
                <p className={`text-sm ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {team.category}
                </p>
                <p className="text-sm">{`Role: ${team.role}`}</p>
                <p className={`text-xs mt-1 ${currentTheme === "dark" ? "text-gray-500" : "text-gray-700"}`}>
                  Created: {formatDate(team.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
