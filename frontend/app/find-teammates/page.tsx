"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { debounce } from "lodash";
import { Search, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

interface Profile {
  _id: string;
  name: string;
  role: string;
  email: string;
  skills: string[];
  location?: string;
}

export default function FindTeammatesPage() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`);
        if (!response.ok) throw new Error("Failed to fetch profiles");

        const data: Profile[] = await response.json();
        setProfiles(data);
      } catch (error) {
        console.log("Failed to fetch profiles", error)
        toast.error("Error fetching profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const currentTheme = mounted ? (theme === "system" ? systemTheme || "light" : theme) : "light";

  const filterProfiles = React.useCallback((term: string) => {
    if (term.length < 3) {
      setFilteredProfiles([]);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const results = profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(lowerTerm) ||
        profile.role.toLowerCase().includes(lowerTerm) ||
        profile.skills.some((skill) => skill.toLowerCase().includes(lowerTerm))
    );
    setFilteredProfiles(results);
  }, [profiles]);

  const debouncedFilter = React.useMemo(() => debounce(filterProfiles, 300), [filterProfiles]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchClicked(false);
    debouncedFilter(value);
  };

  const handleSearch = () => {
    setSearchClicked(true);
    filterProfiles(searchTerm);
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen p-4 md:p-6 transition-colors ${currentTheme === "dark" ? "bg-gray-900 text-white" : "text-black"
        }`}
    >
      <Toaster />
      <div
        className={`w-full max-w-3xl p-6 mt-6 rounded-xl shadow-lg transition-all ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
      >
        <h2 className="text-xl md:text-2xl font-bold text-center">Find Teammates</h2>
        <p className="text-gray-400 text-center mt-2 text-sm md:text-base">
          Search for teammates by skills, roles, or names.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Start typing..."
            value={searchTerm}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border focus:ring-2 transition-all text-sm md:text-base"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-500 transition flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        )}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <Card key={profile._id} className="p-4 rounded-lg shadow-md transition-all border border-gray-300">
                <CardContent>
                  <h3 className="text-lg md:text-xl font-bold">{profile.name}</h3>
                  <p className="text-blue-500 text-sm md:text-base">{profile.role}</p>
                  {profile.location && <p className="text-sm mt-1">{profile.location}</p>}
                  <div className="mt-2">
                    <span className="text-gray-400 text-sm">Skills:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-600 px-2 py-1 rounded-md text-xs md:text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : searchClicked && searchTerm.length >= 3 ? (
            <div className="flex flex-col items-center justify-center text-center mt-6">
              <Search className="w-10 h-10 text-gray-500" />
              <p className="text-red-400 text-lg mt-2 font-semibold">No matching profiles found.</p>
            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
}
