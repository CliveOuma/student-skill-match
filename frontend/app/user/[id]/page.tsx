"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/UserContext";

type Profile = {
  _id: string;
  name: string;
  username: string;
  role: string;
  skills: string[];
  portfolio: string;
  location: string;
  bio: string;
};

export default function UserProfilePage() {
  const { id } = useParams() as { id: string }; 
  const router = useRouter();
  const { user } = useUser(); // Get logged-in user from context
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Profile not found");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleDelete = async () => {
    if (!user?.id || user.id !== profile?._id) {
      alert("You are not authorized to delete this profile.");
      return;
    }

    if (confirm("Are you sure you want to delete this profile?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      router.push("/dashboard"); 
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!profile) return <div className="flex justify-center items-center h-screen">Profile not found</div>;

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="bg-gray-900 text-white rounded-t-lg p-6">
          <CardTitle className="text-3xl">{profile.name}</CardTitle>
          <CardDescription className="text-gray-300">@{profile.username}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Skills:</strong> {profile.skills.join(", ")}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          {profile.portfolio && (
            <p>
              <strong>Portfolio:</strong>
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                {profile.portfolio}
              </a>
            </p>
          )}
          {/* Show Edit & Delete buttons only if the logged-in user owns this profile */}
          {user && user.id === profile._id && (
            <div className="flex justify-between mt-4">
              <Button onClick={() => router.push(`/user/edit`)} className="bg-blue-500 hover:bg-blue-600">
                Edit
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
