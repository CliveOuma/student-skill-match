"use client";

import { Suspense } from "react";
import { SidebarMenu } from "@/app/components/Sidebar";
import NavbarComponent from "@/app/components/Navbar";
import LoadingSpinner from "@/components/ui/loading";

export default function CreateTeamLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarComponent />
            <div className="flex min-h-screen">
                <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 hidden sm:block">
                    <SidebarMenu />
                </aside>
                <main className="flex-1 p-6">
                    <Suspense fallback={<LoadingSpinner/>}>
                        {children}
                    </Suspense>
                </main>
            </div>
            
        </>
    );
}
