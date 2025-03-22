"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useUser } from "@/app/context/UserContext";

export default function HomeBanner() {
    const { user } = useUser();
    const router = useRouter();

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
                        onClick={() => router.push(user ? "/dashboard" : "/register")}
                    >
                        Get started
                    </Button>

                    <Button
                        className="border border-white bg-transparent hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                        onClick={() => router.push(user ? "/find-teammates" : "/login")}
                    >
                        Find a teammate
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 px-4 sm:px-6">
                {[ 
                    { title: "Skill-Based Matching", desc: "Find teammates with complementary skills for your project, whether it’s a hackathon, research, or startup idea." },
                    { title: "Seamless Collaboration", desc: "Connect and collaborate with your team through an intuitive and interactive platform." },
                    { title: "Diverse Opportunities", desc: "Join hackathons, work on personal projects, or collaborate on academic research with like-minded peers." },
                    { title: "Find a Co-Founder", desc: "Have a startup idea? Connect with students who share your vision and build something amazing together." },
                    { title: "Bug Fix Experts", desc: "Stuck with a coding problem? Find experienced students who can debug your project and help you solve issues quickly." },
                    { title: "Enhance Your Skills", desc: "Join a community where you can learn, grow, and improve your skills by working on real-world projects." },
                ].map((feature, index) => (
                    <Card
                        key={index}
                        className="p-6 text-center shadow-lg w-full transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
                        <p className="text-gray-500 mt-2 text-sm sm:text-base">{feature.desc}</p>
                    </Card>
                ))}
            </section>
        </>
    );
}
