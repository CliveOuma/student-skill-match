"use client";

import HomeBanner from "@/components/ui/HomeBanner";
import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";

export default function HomePage() {
    return (
        <>
        <div className="p-6">
            <NavbarComponent />
            <HomeBanner />
            <Footer/>
        </div>
        </>
    );
}
