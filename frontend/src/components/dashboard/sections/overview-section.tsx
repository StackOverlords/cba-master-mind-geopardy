import { usePaginatedCategories } from "../../../hooks/queries/category/useGetAllCategories"
import { usePaginatedQuestions } from "../../../hooks/queries/question/usePaginatedQuestion"
import type { IconType } from "../../../shared/types"
import CategoryIcon from "../../ui/icons/categoryIcon"
import FileTextIcon from "../../ui/icons/fileTextIcon"
import TrophyIcon from "../../ui/icons/trophyIcon"
import UsersIcon from "../../ui/icons/usersIcon"
interface metricCardsTypes {
    title: string,
    value: string,
    icon: IconType,
    iconColor: string,
    textColor: string,
    footerText: string,
    footerColor: string,
    borderColor: string,
    bgColor: string
}
export function OverviewSection() {
    const { data: categoriesData } = usePaginatedCategories({
        page: 1,
        limit: -1,
        sort: "desc"
    })
    const { data: questionsData } = usePaginatedQuestions({
        page: 1,
        limit: -1,
        sort: "desc"
    })
    const metricCards: metricCardsTypes[] = [
        {
            title: "Total Users",
            value: "1,234",
            icon: UsersIcon,
            iconColor: "bg-purple-400",
            textColor: "text-white",
            footerText: "+12% from last month",
            footerColor: "text-green-400",
            borderColor: "border-[#2a2550]/50",
            bgColor: "bg-[#1a1836]/50"
        },
        {
            title: "Active Questions",
            value: questionsData ? questionsData.data.length.toString() : "Loading...",
            icon: FileTextIcon,
            iconColor: "bg-cyan-400",
            textColor: "text-white",
            footerText: "+5% from yesterday",
            footerColor: "text-green-400",
            borderColor: "border-[#2a2550]/50",
            bgColor: "bg-[#1a1836]/50"
        },
        {
            title: "Categories",
            value: categoriesData ? categoriesData.data.length.toString() : "Loading...",
            icon: CategoryIcon,
            iconColor: "bg-yellow-400",
            textColor: "text-white",
            footerText: "Across 15 categories",
            footerColor: "text-slate-400",
            borderColor: "border-[#2a2550]/50",
            bgColor: "bg-[#1a1836]/50"
        },
        {
            title: "Games Played",
            value: "8,901",
            icon: TrophyIcon,
            iconColor: "bg-green-400",
            textColor: "text-white",
            footerText: "+156 today",
            footerColor: "text-green-400",
            borderColor: "border-[#2a2550]/50",
            bgColor: "bg-[#1a1836]/50"
        }
    ]
    const top5Categories = categoriesData?.data
        ?.slice()
        .sort((a, b) => b.questionCount - a.questionCount)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">Manage your quiz application and monitor performance</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {
                    metricCards.map((stat, idx) => (
                        <section
                            key={idx}
                            className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden"
                        >
                            <div className="flex flex-row items-center justify-between p-4 pb-2">
                                <h3 className="text-sm font-medium text-slate-300">
                                    {stat.title}
                                </h3>
                                <span className={`rounded-lg p-1.5 ${stat.iconColor}`}>
                                    <stat.icon className={`size-5`} />
                                </span>
                            </div>
                            <div className="p-4 pt-2">
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className={`text-xs ${stat.footerColor}`}>{stat.footerText}</p>
                            </div>
                        </section>
                    ))
                }

            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-dashboard-border/50">
                        <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                        <p className="text-sm text-slate-400">Latest user activities and game sessions</p>
                    </div>
                    <div className="p-4 space-y-4">
                        {[
                            { user: "Alice Johnson", action: "Completed Science Quiz", score: "95%", time: "2 min ago" },
                            { user: "Bob Smith", action: "Started History Quiz", score: "In Progress", time: "5 min ago" },
                            { user: "Carol Davis", action: "Achieved High Score", score: "98%", time: "10 min ago" },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-dashboard-border/50">
                                <div>
                                    <p className="text-white font-medium">{activity.user}</p>
                                    <p className="text-sm text-slate-400">{activity.action}</p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${activity.score === "In Progress"
                                            ? "bg-purple-500/20 text-purple-300"
                                            : "bg-green-500/20 text-green-300"
                                            }`}
                                    >
                                        {activity.score}
                                    </span>
                                    <p className="text-xs text-slate-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-dashboard-border/50">
                        <h3 className="text-lg font-medium text-white">Popular Categories</h3>
                        <p className="text-sm text-slate-400">Average scores by quiz category</p>
                    </div>
                    <div className="p-4 space-y-4">
                        {categoriesData && top5Categories?.map((cat, index) => (
                            <div key={index} className="py-1.5 px-2 rounded-md w-full flex gap-2 items-center bg-dashboard-border/0">
                                <div className="flex justify-between text-sm w-full">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-3 rounded-full bg-purple-500`}></div>
                                        <span className="text-slate-300">{cat.name}</span>
                                    </div>
                                    <span className="text-white">{cat.questionCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
