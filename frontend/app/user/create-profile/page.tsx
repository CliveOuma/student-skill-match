"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProfile() {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    role: "",
    skills: "",
    phone: "",
    portfolio: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);


  const currentTheme = mounted ? (theme === "system" ? systemTheme || "light" : theme) : "light";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to create a profile!");
      return;
    }

    const payload = {
      name: profile.name.trim(),
      username: profile.username.trim(),
      role: profile.role.trim(),
      skills: profile.skills.split(",").map((skill) => skill.trim()),
      phone: profile.phone, 
      portfolio: profile.portfolio.trim(),
      location: profile.location.trim(),
      bio: profile.bio.trim(),
    };

    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      

      if (!response.ok) {
        toast.error(data.message || "Failed to create profile!");
        return;
      }

      toast.success("Profile created successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      console.error("Profile creation failed:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen transition-colors ${currentTheme === "dark" ? "bg-gray-900 text-white" : "text-black"
        }`}
    >
      <Toaster />
      <div
        className={`p-8 rounded-2xl shadow-lg w-full max-w-lg transition-all ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" type="text" name="name" value={profile.name} onChange={handleChange} required className="w-full" />
          </div>

          <div>
            <Label htmlFor="username">Username *</Label>
            <Input id="username" type="text" name="username" value={profile.username} onChange={handleChange} required className="w-full" />
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              type="text"
              name="role"
              value={profile.role}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Frontend, Backend, Fullstack, Data Analyst, AI Developer,"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated) *</Label>
            <Input id="skills" type="text" name="skills" value={profile.skills} onChange={handleChange} required className="w-full" />
          </div>
          <div>
            <Label htmlFor="Phone Number">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
              className="w-full"
              pattern="^\+?[0-9]{7,15}$"
            />

          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio/Github Link</Label>
            <Input
              id="portfolio"
              type="url"
              name="portfolio"
              value={profile.portfolio}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full"
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Create Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
