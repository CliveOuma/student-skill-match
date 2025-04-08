"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Bug,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "@/app/context/UserContext";
import { toast } from "react-hot-toast";

export default function HomeBanner() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStartedClick = () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }
    router.push("/dashboard");
  };

  const handleFindTeammateClick = () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }
    router.push("/find-teammates");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-10 px-4 sm:px-6 md:py-16 mt-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl">
        <motion.h1
          className="text-xl sm:text-2xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Find the Perfect Team for Your Next Project!
        </motion.h1>
        <p className="text-sm sm:text-base md:text-lg opacity-90">
          Match with students who complement your skills and interests for hackathons, personal projects, and academic collaborations.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
            onClick={handleGetStartedClick}
          >
            Get started
          </Button>

          <Button
            className="border border-white bg-transparent hover:bg-white hover:text-blue-600 w-full sm:w-auto"
            onClick={handleFindTeammateClick}
          >
            Find a teammate
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 px-4 sm:px-6">
        {[ 
          {
            title: "Skill-Based Matching",
            icon: <Users className="mx-auto text-blue-600 w-10 h-10 mb-4" />,
            desc: "Find teammates with complementary skills for your project, whether it’s a hackathon, research, or startup idea.",
          },
          {
            title: "Collaboration & Opportunities",
            icon: <Lightbulb className="mx-auto text-yellow-500 w-10 h-10 mb-4" />,
            desc: "Connect with your team effortlessly and explore diverse opportunities like hackathons, academic research, and side projects.",
          },          
          {
            title: "Find a Co-Founder",
            icon: <UserPlus className="mx-auto text-green-600 w-10 h-10 mb-4" />,
            desc: "Have a startup idea? Connect with students who share your vision and build something amazing together.",
          },
          {
            title: "Bug Fix Experts",
            icon: <Bug className="mx-auto text-red-500 w-10 h-10 mb-4" />,
            desc: "Stuck with a coding problem? Find experienced students who can debug your project and help you solve issues quickly.",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="p-6 text-center shadow-lg w-full transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
          >
            {feature.icon}
            <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">{feature.desc}</p>
          </Card>
        ))}
      </section>
    </>
  );
}
