"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Select, { MultiValue, SingleValue } from "react-select";


type SelectOption = {
    value: string;
    label: string;
};

const skills = {
    technical: [
        "Frontend (React, Vue, Angular, Next.js)",
        "Backend (Node.js, Express.js, Django, Laravel, Spring Boot)",
        "Databases (MongoDB, MySQL, PostgreSQL, Firebase)",
        "Cloud & DevOps (AWS, Docker, Kubernetes, CI/CD)",
        "Cybersecurity (Ethical Hacking, Network Security)",
        "AI & Machine Learning (TensorFlow, PyTorch, Data Science, NLP)",
        "Blockchain & Web3 (Ethereum, Solidity, Smart Contracts)",
        "Mobile Development (Flutter, React Native, Swift, Kotlin)",
        "UI/UX Design",
    ],
};
const projectCategories = ["Web Development", "Data Science", "AI & ML", "Cybersecurity", "Blockchain"];
const teamTypes = ["Hackathon Team", "Startup Team", "Research Group", "Freelance Team"];

export default function TeamFormationForm() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Form state
    const [teamName, setTeamName] = useState("");
    const [groupLeaderPhone, setGroupLeaderPhone] = useState(""); 
    const [projectCategory, setProjectCategory] = useState("");
    const [teamType, setTeamType] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [teamSize, setTeamSize] = useState(1);
    const [description, setDescription] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handlers for Select components
    const handleSkillChange = (selectedOptions: MultiValue<SelectOption>) => {
        setSelectedSkills(selectedOptions.map((option) => option.value));
    };

    const handleProjectCategoryChange = (selectedOption: SingleValue<SelectOption>) => {
        setProjectCategory(selectedOption?.value || "");
    };

    const handleTeamTypeChange = (selectedOption: SingleValue<SelectOption>) => {
        setTeamType(selectedOption?.value || "");
    };

    const handleSubmit = async () => {
        // Ensure required fields are provided
        if (
            !teamName ||
            !groupLeaderPhone ||
            !projectCategory ||
            !teamType ||
            selectedSkills.length === 0 ||
            !teamSize ||
            !description
        ) {
            toast.error("Please fill in all the required fields.");
            return;
        }

        // Ensure token exists
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to create a team.");
            return;
        }

        // Phone number validation (basic format)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(groupLeaderPhone)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: teamName,
                    category: projectCategory,
                    groupLeaderPhone,
                    teamType,
                    skills: selectedSkills,
                    teamSize: Number(teamSize),
                    description,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create team");
            }

            toast.success("Team created successfully!");
            setTimeout(() => router.push("/team-formation"), 2000);
        } catch (error: unknown) {
            console.error("Error creating team:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to create team. Please try again.");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 dark:bg-gray-800 dark:text-white transition-colors">
            <Toaster />
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Create a Team</h1>
            </div>
            <div className="mb-4">
                <h2 className="font-semibold mb-2">Team Name</h2>
                <Input
                    type="text"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="p-2 w-full border rounded-md"
                />
            </div>
            {mounted && (
                <>
                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Group Leader Phone Number</h2>
                        <Input
                            type="text"
                            placeholder="Enter phone number"
                            value={groupLeaderPhone}
                            onChange={(e) => setGroupLeaderPhone(e.target.value)}
                            className="p-2 w-full border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Select Project Category</h2>
                        <Select
                            options={projectCategories.map((category) => ({ value: category, label: category }))}
                            styles={{
                                control: (base) => ({ ...base, backgroundColor: "#2a2a2a", color: "white" }),
                                singleValue: (base) => ({ ...base, color: "white" }),
                                menu: (base) => ({ ...base, backgroundColor: "#2a2a2a" }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? "#333" : "#2a2a2a",
                                    color: "white",
                                }),
                            }}
                            onChange={handleProjectCategoryChange}
                        />
                    </div>

                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Select Team Type</h2>
                        <Select
                            options={teamTypes.map((type) => ({ value: type, label: type }))}
                            styles={{
                                control: (base) => ({ ...base, backgroundColor: "#2a2a2a", color: "white" }),
                                singleValue: (base) => ({ ...base, color: "white" }),
                                menu: (base) => ({ ...base, backgroundColor: "#2a2a2a" }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? "#333" : "#2a2a2a",
                                    color: "white",
                                }),
                            }}
                            onChange={handleTeamTypeChange}
                        />
                    </div>

                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Select Required Skills</h2>
                        <Select
                            isMulti
                            options={skills.technical.map((skill) => ({ value: skill, label: skill }))}
                            styles={{
                                control: (base) => ({ ...base, backgroundColor: "#2a2a2a", color: "white" }),
                                singleValue: (base) => ({ ...base, color: "white" }),
                                menu: (base) => ({ ...base, backgroundColor: "#2a2a2a" }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? "#333" : "#2a2a2a",
                                    color: "white",
                                }),
                            }}
                            onChange={handleSkillChange}
                        />
                    </div>
                </>
            )}
            <Input
                type="number"
                placeholder="Team Size"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="mb-4"
            />
            <Textarea
                placeholder="Team Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4"
            />
            <Button onClick={handleSubmit} className="w-full">Create Team</Button>
        </div>
    );
}
