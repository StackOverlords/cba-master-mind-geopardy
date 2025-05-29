import { useState } from "react"
import TrophyIcon from "../ui/icons/trophyIcon"
import UserIcon from "../ui/icons/userIcon"
import { useAuthStore } from "../../stores/authStore"
import type { UserRole } from "../../shared/auth.types"
import MasterMindLogo from "../../assets/appLogo/Logo-MasterMind.webp"
import DashboardIcon from "../ui/icons/dashboardIcon"
import CategoryIcon from "../ui/icons/categoryIcon"
import SettingsIcon from "../ui/icons/settingsIcon"
import LogoutIcon from "../ui/icons/logoutIcon"
import type { IconType } from "../../shared/types"
import UsersIcon from "../ui/icons/usersIcon"
import FileTextIcon from "../ui/icons/fileTextIcon"

interface AppSidebarProps {
    activeSection: string
    setActiveSection: (section: string) => void
    userRole: UserRole
    setUserRole: (role: UserRole) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

interface MenuItems {
    title: string,
    icon: IconType,
    role: UserRole,
    id: string
}

const menuItems: MenuItems[] = [
    {
        title: "Overview",
        icon: DashboardIcon,
        role: 'admin',
        id: "overview",
    },
    {
        title: "User Management",
        icon: UsersIcon,
        role: 'admin',
        id: "users",
    },
    {
        title: "Categories",
        icon: CategoryIcon,
        role: 'admin',
        id: "categories",
    },
    {
        title: "Questions",
        icon: FileTextIcon,
        role: 'admin',
        id: "questions",
    },
    {
        title: "Game Analytics",
        icon: TrophyIcon,
        role: 'admin',
        id: "analytics",
    },
    // player options
    {
        title: "Dashboard",
        icon: DashboardIcon,
        role: 'player',
        id: "overview",
    },
    {
        title: "Play Quiz",
        //   icon: Play,
        icon: UserIcon,
        role: 'player',
        id: "play",
    },
    {
        title: "Game History",
        // icon: History,
        icon: UserIcon,
        role: 'player',
        id: "history",
    },
    {
        title: "Leaderboard",
        icon: TrophyIcon,
        role: 'player',
        id: "leaderboard",
    },
]

const AppSidebar = ({
    activeSection,
    setActiveSection,
    userRole,
    setUserRole,
    isOpen,
    // setIsOpen,
}: AppSidebarProps) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { hasRole, user } = useAuthStore()

    return (
        <div
            className={`${isOpen ? "w-64" : "w-20"} hidden md:flex transition-all duration-300 ease-in-out h-screen bg-gradient-to-br from-leaderboard-bg/60 to-black/30 border-r border-border/50 flex-col overflow-hidden`}
        >
            <div className={`${isOpen ? "p-6" : "p-2"}`}>
                <div className="flex items-center gap-3">
                    <img
                        className="h-8"
                        src={MasterMindLogo} alt="" />
                    <div
                        className={`${isOpen ? "opacity-100" : "opacity-0 md:opacity-0"} transition-opacity duration-300 overflow-hidden`}
                    >
                        <h2 className="text-md font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            MASTER MIND
                        </h2>
                        <p className="text-xs whitespace-nowrap">Dashboard</p>
                    </div>
                </div>
            </div>

            <div className="px-4 flex-1 overflow-y-auto">
                <div className="mb-6">
                    <p className={`text-slate-400 text-xs uppercase tracking-wider mb-2 px-2 ${!isOpen && "md:hidden"}`}>
                        {userRole === "admin" ? "Administration" : "Player Menu"}
                    </p>
                    <ul>
                        {menuItems.map((item) => (
                            hasRole(item.role) && (
                                <li key={item.id} className="mb-2">
                                    <button
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full text-sm flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors
                                    ${activeSection === item.id
                                                ? "bg-leaderboard-bg text-white"
                                                : "text-[#8a8aa3] hover:text-white hover:bg-leaderboard-bg/80"
                                            }
                                        `}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <span
                                            className={`${isOpen ? "" : "hidden"} transition-opacity duration-300 whitespace-nowrap`}
                                        >
                                            {item.title}
                                        </span>
                                    </button>
                                </li>
                            )
                        ))}
                    </ul>
                </div>

                <div className="h-px bg-border/50 my-4"></div>

                <div className="mb-6">
                    <p className={`text-slate-400 text-xs uppercase tracking-wider mb-2 px-2 ${!isOpen && "md:hidden"}`}>
                        Settings
                    </p>
                    <ul>
                        <li>
                            <button
                                onClick={() => setActiveSection("settings")}
                                className={`w-full text-sm flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors
                                ${activeSection === "settings"
                                        ? "bg-leaderboard-bg text-white"
                                        : "text-[#8a8aa3] hover:text-white hover:bg-leaderboard-bg/80"
                                    }
                               `}
                            >
                                <SettingsIcon className="size-5 flex-shrink-0" />
                                <span
                                    className={`${isOpen ? "" : "hidden"} transition-opacity duration-300 whitespace-nowrap`}
                                >
                                    Settings
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="p-4 border-t border-border/50 relative">
                <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-slate-300 hover:text-white hover:bg-leaderboard-bg/80 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                        RG
                    </div>
                    <div
                        className={`flex-1 min-w-0 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"} transition-opacity duration-300`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm truncate">{user?.displayName}</span>
                            <span
                                className={`text-xs px-3 py-0.5 rounded-full inline-flex w-fit bg-purple-400/40`}
                            >
                                {user?.role}
                            </span>
                        </div>
                    </div>
                    {/* <ChevronDown
            className={`w-4 h-4 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"} transition-opacity duration-300`}
          /> */}
                </button>

                {userMenuOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-background border border-border/50 backdrop-blur-xl rounded-md shadow-xl p-2 z-10">
                        <button className="w-full my-1.5 rounded-md flex items-center py-2 px-4 text-sm transition-colors duration-300 text-gray-300 hover:bg-border/50 hover:text-white cursor-pointer gap-3">
                            <UserIcon className="w-4 h-4" />
                            <span>My Account</span>
                        </button>
                        <div className="h-px bg-border/50 my-1"></div>
                        <button
                            onClick={() => setUserRole(userRole === "admin" ? "player" : "admin")}
                            className="w-full my-1.5 rounded-md flex items-center py-2 px-4 text-sm transition-colors duration-300 text-gray-300 hover:bg-border/50 hover:text-white cursor-pointer gap-3"
                        >
                            {/* <Shield className="w-4 h-4" /> */}
                            <span>Switch to {userRole === "admin" ? "Player" : "Admin"}</span>
                        </button>
                        <div className="h-px bg-border/50 my-1"></div>
                        <button className="w-full my-1.5 rounded-md flex items-center py-2 px-4 text-sm transition-colors duration-300 text-gray-300 hover:bg-border/50 hover:text-white cursor-pointer gap-3">
                            <LogoutIcon className="size-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default AppSidebar