import LeftCollapseIcon from "../ui/icons/leftCollapse"
import AccountMenu from "../ui/accountMenu"
import { useEffect, useState } from "react"
import { hasLoggedBefore } from "../../utils/localStorage"
import { useAuthStore } from "../../stores/authStore"
import UserIcon from "../ui/icons/userIcon"
import { Outlet } from "react-router"

interface DashboardContentProps {
    activeSection: string
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export function DashboardContent({ activeSection, sidebarOpen, setSidebarOpen }: DashboardContentProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [hasLogged, setHasLogged] = useState<boolean>(hasLoggedBefore());
    useEffect(() => {
        setHasLogged(hasLoggedBefore());
    }, [isAuthenticated]);

    return (
        <div className="flex flex-col h-screen">
            <header className="relative h-16 z-10 flex items-center justify-between gap-2 border-b border-border/50 bg-leaderboard-bg/50 px-2 sm:px-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="size-6 sm:size-8 cursor-pointer z-50 flex items-center justify-center text-slate-300 hover:text-white rounded-md hover:bg-[#2a2550]/50 transition-colors"
                    >
                        <LeftCollapseIcon className="size-5" />
                    </button>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
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
