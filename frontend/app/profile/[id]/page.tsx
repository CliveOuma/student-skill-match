"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import LoadingSpinner from "@/components/ui/loading";

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
  phone: string;
};

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const { user } = useUser(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${id}`);
        if (!response.ok) throw new Error("Profile not found");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (!profile) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;

  const openWhatsApp = () => {
    if (profile?.phone) {
      const phoneNumber = String(profile.phone).replace(/\D/g, "");
      if (phoneNumber.length > 0) {
        window.open(`https://wa.me/${phoneNumber}`, "_blank");
      } else {
        alert("Invalid phone number.");
      }
    } else {
      alert("WhatsApp contact not available.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        alert("Profile deleted successfully.");
        router.push("/dashboard"); 
      } else {
        alert("Failed to delete profile.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("An error occurred while deleting.");
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
          <p className="text-sm flex flex-wrap gap-2">
            <strong className="mr-2">Skills:</strong>
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="py-1 px-1 bg-gray-600 text-white rounded-md text-xs"
              >
                {skill}
              </span>
            ))}
          </p>

          <p><strong>Bio: </strong> {profile.bio}</p>
          <p><strong>Location: </strong> {profile.location}</p>
          <p><strong>Phone: </strong> {profile.phone}</p>
          {profile.portfolio && (
            <p>
              <strong>Portfolio: </strong>
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                {profile.portfolio}
              </a>
            </p>
          )}
          <div className="flex mt-3">
            <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-lg" onClick={openWhatsApp}>
              Chat with {profile?.name}
            </Button>
          </div>

          {/* Show Delete Button if logged-in user is viewing their own profile */}
          {user?.id === profile._id && (
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-4 rounded-lg" onClick={handleDelete}>
              Delete Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
