"use client";

import { Suspense } from "react";
import LoadingCircle from "@/components/ui/loading";
import { SidebarMenu } from "@/app/components/Sidebar";
import NavbarComponent from "@/app/components/Navbar";

export default function CreateProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarComponent />
            <div className="flex min-h-screen">
                <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 hidden sm:block">
                    <SidebarMenu />
                </aside>
                <main className="flex-1 p-6">
                    <Suspense fallback={<LoadingCircle />}>
                        {children}
                    </Suspense>
                </main>
            </div>
            
        </>
    );
}
