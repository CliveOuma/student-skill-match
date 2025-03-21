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
                <Card className="p-6 text-center shadow-lg w-full">
                    <h3 className="text-lg sm:text-xl font-semibold">Skill-Based Matching</h3>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Find teammates with complementary skills for your project, whether it is a hackathon, research, or startup idea.
                    </p>
                </Card>

                <Card className="p-6 text-center shadow-lg w-full">
                    <h3 className="text-lg sm:text-xl font-semibold">Seamless Collaboration</h3>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Connect and collaborate with your team through an intuitive and interactive platform.
                    </p>
                </Card>

                <Card className="p-6 text-center shadow-lg w-full">
                    <h3 className="text-lg sm:text-xl font-semibold">Diverse Opportunities</h3>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Join hackathons, work on personal projects, or collaborate on academic research with like-minded peers.
                    </p>
                </Card>
            </section>

        </>
    );
}
