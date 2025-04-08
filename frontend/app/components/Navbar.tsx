"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Sun, Moon } from "lucide-react";
import { Sidebar } from "./Sidebar";
import Avatar from "@/components/ui/Avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import * as Icon from "react-feather";
import { AiFillCaretDown } from "react-icons/ai";
import { useAuth } from "../context/UserContext";

export default function Navbar() {
    const router = useRouter();
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isExpired, logout } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine the current theme
    const currentTheme = mounted ? (theme === "system" ? systemTheme || "light" : theme) : "light";

    return (
        <nav className={`transition-colors shadow-md ${currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section (Logo + Mobile Menu) */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Sidebar */}
                        <div className="sm:hidden">
                            <Sheet>
                                <SheetTrigger>
                                    <Menu className="text-current mt-2 hover:text-opacity-80 transition" size={26} />
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[280px] sm:w-[340px] bg-white dark:bg-gray-900"
                                >
                                    <SheetHeader>
                                        <SheetTitle className="text-xl font-bold">SkillMatch</SheetTitle>
                                        <Sidebar />
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Logo */}
                        <Link href="/" className="text-xl font-semibold tracking-wide hover:opacity-80 transition">
                            SkillMatch
                        </Link>
                    </div>

                    {/* Right Section (Theme Toggle + Avatar Dropdown) */}
                    <div className="flex items-center gap-6">
                        {/* Dark/Light Mode Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full transition-all dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                                {currentTheme === "dark" ? (
                                    <Sun size={22} className="text-yellow-400" />
                                ) : (
                                    <Moon size={22} className="text-gray-800" />
                                )}
                            </button>
                        )}

                        {/* Avatar Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <Avatar />
                                    <AiFillCaretDown className="text-current" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className={`w-44 shadow-lg border rounded-lg transition ${currentTheme === "dark" ? "bg-white text-gray-900 border-gray-300" : "bg-white text-black"
                                    }`}
                            >
                                {!isExpired ? (
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="py-2 px-3 flex items-center gap-2 hover:bg-opacity-80 transition"
                                    >
                                        <Icon.LogOut size={15} /> Logout
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => router.push("/register")}
                                            className="py-2 px-3 flex items-center gap-2 hover:bg-opacity-80 transition"
                                        >
                                            <Icon.UserPlus size={15} /> Register
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => router.push("/login")}
                                            className="py-2 px-3 flex items-center gap-2 hover:bg-opacity-80 transition"
                                        >
                                            <Icon.LogIn size={15} /> Login
                                        </DropdownMenuItem>
                                    </>
                                )}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
