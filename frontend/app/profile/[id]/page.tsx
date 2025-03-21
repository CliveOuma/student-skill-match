"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LoadingCircle from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

type Profile = {
  _id: string;
  name: string;
  username: string;
  role: string;
  skills: string[];
  portfolio: string;
  location: string;
  bio: string;
  whatsapp: string; 
};

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profiles/${id}`);
        if (!response.ok) throw new Error("Profile not found");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (!profile) return <div className="flex justify-center items-center h-screen"><LoadingCircle /></div>;
  const openWhatsApp = () => {
    if (profile?.whatsapp) {
      window.open(`https://wa.me/${profile.whatsapp}`, "_blank");
    } else {
      alert("WhatsApp contact not available.");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-lg">
        <CardHeader className="bg-gray-900 text-white rounded-t-lg p-6">
          <CardTitle className="text-2xl sm:text-3xl">{profile.name}</CardTitle>
          <CardDescription className="text-gray-300">@{profile.username}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <p><strong>Role: </strong>{profile.role}</p>
          <p><strong>Skills: </strong> {profile.skills.join(", ")}</p>
          <p><strong>Bio: </strong> {profile.bio}</p>
          <p><strong>Location: </strong> {profile.location}</p>
          {profile.portfolio && (
            <p>
              <strong>Portfolio: </strong>
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                {profile.portfolio}
              </a>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="w-full sm:w-auto rounded-lg" onClick={() => router.push(`/chat/${id}`)}>
              Chat with {profile?.name}
            </Button>
            <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-lg" onClick={openWhatsApp}>
              Chat on WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
