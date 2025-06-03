import { useEffect, useState } from "react"
import { DashboardContent } from "../components/dashboard/dashboard-content"
import AppSidebar from "../components/dashboard/app-sidebar"
import type { UserRole } from "../shared/auth.types"
import GradientBackground from "../components/ui/gradientBackground"
import { FloatingNavbar } from "../components/dashboard/floatingNavbar"
import { useAuthStore } from "../stores/authStore"

export default function DashboardPage() {
    const [activeSection, setActiveSection] = useState("overview")
    const [userRole, setUserRole] = useState<UserRole>("player")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const role = useAuthStore((state) => state.user?.role)
    useEffect(() => {
        if (role) {
            setUserRole(role)
        }
    }, [role])

    return (
        <>
            <GradientBackground />
            <FloatingNavbar />
            <div id="dashboard-container" className="min-h-screen bg-black/50 flex backdrop-blur-sm">
                <AppSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    userRole={userRole}
                    setUserRole={setUserRole}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />
                <main className="flex-1">
                    <DashboardContent
                        activeSection={activeSection}
                        userRole={userRole}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </main>
            </div>
        </>
    )
}
