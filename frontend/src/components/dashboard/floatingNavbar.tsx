import { Home } from "lucide-react";
import { FloatingDock } from "../ui/floating-dock";
import CategoryIcon from "../ui/icons/categoryIcon";
import DashboardIcon from "../ui/icons/dashboardIcon";
import FileTextIcon from "../ui/icons/fileTextIcon";
import SettingsIcon from "../ui/icons/settingsIcon";
import TrophyIcon from "../ui/icons/trophyIcon";
import UsersIcon from "../ui/icons/usersIcon";

export function FloatingNavbar() {
    const links = [
        {
            title: "Home",
            icon: (
                <Home className="h-full w-full text-neutral-300" />
            ),
            href: "/",
        },

        {
            title: "Dashboard",
            icon: (
                <DashboardIcon className="h-full w-full text-neutral-300" />
            ),
            href: "/dashboard/overview",
        },
        {
            title: "Users",
            icon: (
                <UsersIcon className="h-full w-full text-neutral-300" />
            ),
            href: "/dashboard/users",
        },
        {
            title: "Categories",
            icon: (
                <CategoryIcon className="h-full w-full text-neutral-300" />
            ),
            href: "/dashboard/categories",
        },
        {
            title: "Questions",
            icon: (
                <FileTextIcon className="h-full w-full text-neutral-300" />
            ),
            href: "/dashboard/questions",
        },

        {
            title: "Leaderboard",
            icon: (
                <TrophyIcon className="h-full w-full text-neutral-300" />
            ),
            href: "#",
        },
        {
            title: "Settings",
            icon: (
                <SettingsIcon className="h-full w-full text-neutral-300" />
            ),
            href: "/dashboard/settings",
        },
    ];
    return (
        <div className="absolute z-50 items-center justify-center bottom-0 w-full md:hidden">
            <div className="bg-linear-to-b from-transparent to-black/50 backdrop-blur-sm mask-t-from-50% inset-0 absolute"></div>
            <FloatingDock
                items={links}
            />
        </div>
    );
}
