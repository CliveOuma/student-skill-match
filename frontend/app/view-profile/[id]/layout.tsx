import type { Metadata } from "next";
import { Suspense } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import Loading from "@/components/ui/loading";

export const metadata: Metadata = {
    title: "Student Skill Match",
    description: "Skill-based student team formation.",
    icons: { icon: "/std-match-logo.png" },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="flex min-h-screen">
                <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 hidden sm:block">
                    <Sidebar/>
                </aside>
                <main className="flex-1 p-6">
                    <Suspense fallback={<Loading/>}>
                        {children}
                    </Suspense>
                </main>
            </div>
        </>
    );
}
