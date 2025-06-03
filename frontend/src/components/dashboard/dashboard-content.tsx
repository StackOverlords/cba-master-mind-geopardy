import { OverviewSection } from "./sections/overview-section"
import { UserManagementSection } from "./sections/userManagement-section"
import { CategoriesSection } from "./sections/categories-section"
import { QuestionsSection } from "./sections/questions-section"
import { AnalyticsSection } from "./sections/analytics-section"
import { PlaySection } from "./sections/play-section"
import { HistorySection } from "./sections/history-section"
import { LeaderboardSection } from "./sections/leaderboard-section"
import { SettingsSection } from "./sections/settings-section"
import type { UserRole } from "../../shared/auth.types"
import LeftCollapseIcon from "../ui/icons/leftCollapse"
import AccountMenu from "../ui/accountMenu"
import { useEffect, useState } from "react"
import { hasLoggedBefore } from "../../utils/localStorage"
import { useAuthStore } from "../../stores/authStore"
import UserIcon from "../ui/icons/userIcon"
import { Outlet } from "react-router"

interface DashboardContentProps {
    activeSection: string
    userRole: UserRole
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export function DashboardContent({ activeSection, userRole, sidebarOpen, setSidebarOpen }: DashboardContentProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [hasLogged, setHasLogged] = useState<boolean>(hasLoggedBefore());
    useEffect(() => {
        setHasLogged(hasLoggedBefore());
    }, [isAuthenticated]);
    // const renderSection = () => {
    //     switch (activeSection) {
    //         case "overview":
    //             return <OverviewSection userRole={userRole} />
    //         case "users":
    //             return userRole === "admin" ? <UserManagementSection /> : <OverviewSection userRole={userRole} />
    //         case "categories":
    //             return userRole === "admin" ? <CategoriesSection /> : <OverviewSection userRole={userRole} />
    //         case "questions":
    //             return userRole === "admin" ? <QuestionsSection /> : <OverviewSection userRole={userRole} />
    //         //   case "analytics":
    //         //     return userRole === "admin" ? <AnalyticsSection /> : <OverviewSection userRole={userRole} />
    //         case "play":
    //             return <PlaySection />
    //         //   case "history":
    //         //     return <HistorySection />
    //         //   case "leaderboard":
    //         //     return <LeaderboardSection />
    //         case "settings":
    //             return <SettingsSection />
    //         default:
    //             return <OverviewSection userRole={userRole} />
    //     }
    // }

    return (
        <div className="flex flex-col h-screen">
            <header className="relative h-16 z-10 flex items-center justify-between gap-2 border-b border-border/50 bg-leaderboard-bg/50 px-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="size-8 cursor-pointer z-50 flex items-center justify-center text-slate-300 hover:text-white rounded-md hover:bg-[#2a2550]/50 transition-colors"
                    >
                        <LeftCollapseIcon className="size-5" />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-white capitalize">{activeSection}</span>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                    {
                        isAuthenticated ? (
                            <AccountMenu />
                        ) : hasLogged ? (
                            <div className="size-10 flex items-center justify-center rounded-full animate-pulse border-border/60 bg-background/50 hover:bg-background/70 border backdrop-blur-sm">
                                <UserIcon className="size-5 text-border/60" />
                            </div>
                        ) : null
                    }
                </div>
            </header>
            <div className="flex-1 px-3 pt-3 sm:px-6 sm:pt-3 pb-20 md:pb-6 overflow-y-auto bg-gradient-to-b backdrop-blur-sm from-leaderboard-bg/60 to-black/30">
                {/* {renderSection()} */}
                <Outlet />
            </div>
        </div>
    )
}
