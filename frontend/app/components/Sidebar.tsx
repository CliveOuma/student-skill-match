"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Search, Users,} from "lucide-react";
import Link from "next/link";
import { useUser } from "../context/UserContext";

type Menu = {
  label: string;
  name: string;
  icon: React.ReactNode;
  href: string;
};

export function SidebarMenu() {
  const { user } = useUser(); //Get logged-in user

  // If no user, return null (hide sidebar)
  if (!user) return null;

  const menus: Menu[] = [
    { label: "General", name: "Dashboard", icon: <Home size={20} className="mr-3" />, href: "/dashboard" },
    { label: "Find Team", name: "Find Teammates", icon: <Search size={20} className="mr-3" />, href: "/find-teammates" },
    { label: "Teams", name: "Team Formation", icon: <Users size={20} className="mr-3" />, href: "/team-formation" },
  ];

  return (
    <ScrollArea className="h-screen lg:w-52 sm:w-full rounded-md">
      <div className="md:px-4 sm:p-0 mt-5">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            href={menu.href}
            className="flex text-sm font-medium h-12 dark:bg-background my-2 items-center p-4 hover:text-primary rounded-md"
          >
            <div className="w-6">{menu.icon}</div>
            {menu.name}
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
