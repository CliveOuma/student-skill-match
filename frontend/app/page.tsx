"use client";

import HomeBanner from "@/components/ui/HomeBanner";
import NavbarComponent from "./components/Navbar";

export default function HomePage() {
    return (
        <>
        <div className="p-6">
            <NavbarComponent />
            <HomeBanner />
        </div>
        </>
    );
}
