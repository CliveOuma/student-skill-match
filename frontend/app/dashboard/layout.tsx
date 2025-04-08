"use client";

import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Loading from "@/components/ui/loading";
import { Sidebar } from "../components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar/>
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
