import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Student Skill Match",
    description: "Skill-based student team formation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <Providers>
                        <Toaster position="top-center" reverseOrder={false} />
                        {children}
                    </Providers>
                </AuthProvider>
            </body>
        </html>
    );
}
