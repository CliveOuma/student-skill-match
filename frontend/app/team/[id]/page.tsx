"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/UserContext";
import LoadingSpinner from "@/components/ui/loading";

type Team = {
  _id: string;
  name: string;
  category: string;
  groupLeaderPhone: string;  
  teamType: string;
  skills: string[];
  teamSize: number;
  description?: string;
  createdAt: string;
  createdBy: { _id: string; name: string; email: string } | string;
};

export default function TeamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Team not found");
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    if (id) fetchTeam();
  }, [id]);

  const handleDelete = async () => {
    if (!team) return;
    if (!user || user.id !== team.createdBy) {
      alert("You are not authorized to delete this team.");
      return;
    }

    if (confirm("Are you sure you want to delete this team?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to delete team");
        alert("Team deleted successfully!");
        router.push("/team-formation");
      } catch (error) {
        console.error("Error deleting team:", error);
        alert("Failed to delete team. Please try again.");
      }
    }
  };

  const openWhatsApp = () => {
    if (team && team.groupLeaderPhone) {
      const url = `https://wa.me/${team.groupLeaderPhone}`;
      window.open(url, "_blank");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (!team) return <div className="flex justify-center items-center h-screen">Team not found</div>;

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="bg-gray-900 text-white rounded-t-lg p-6">
          <CardTitle className="text-3xl">{team.name}</CardTitle>
          <CardDescription className="text-gray-300">{team.teamType}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p><strong>Group Leader Phone Number: </strong>{team.groupLeaderPhone}</p>
          <p><strong>Category: </strong>{team.category}</p>
          <p><strong>Skills: </strong>{team.skills.join(", ")}</p>
          <p><strong>Team Size: </strong>{team.teamSize}</p>
          <p><strong>Description: </strong>{team.description || "No description provided"}</p>
          <p className="text-sm text-gray-500">Created: {new Date(team.createdAt).toLocaleDateString()}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-lg" 
            onClick={openWhatsApp} >
              Request to Join
            </Button>
          </div>
          {/* Show Delete Button only if the logged-in user is the creator */}
          {user && team?.createdBy && user.id === (typeof team.createdBy === "string" ? team.createdBy : team.createdBy._id) && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete Team
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
