const DashboardSkeleton = () => {
    return (
        <div className="h-full w-full min-h-screen bg-gradient-to-b backdrop-blur-sm from-leaderboard-bg/60 to-black/30 flex">
            {/* Sidebar Skeleton */}
            <div className="w-64 p-6 space-y-6 border-r border-border/50 hidden md:block">
                {/* Logo Skeleton */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="space-y-4">
                    <div className="h-3 bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`flex items-center space-x-3 p-2 rounded-md ${i === 0 ? 'bg-dashboard-border/50' : ''}`}>
                                <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded w-28 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-4 pt-8">
                    <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                </div>

                {/* User Profile Skeleton */}
                <div className="absolute bottom-6 left-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="space-y-1">
                        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 px-6 py-2">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-80 animate-pulse"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="h-8 bg-gray-700 rounded w-64 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-80 animate-pulse"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-dashboard-bg/50 rounded-lg p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                                    <div className="h-8 bg-gray-700 rounded w-16 animate-pulse"></div>
                                    <div className="h-3 bg-gray-700 rounded w-24 animate-pulse"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Section - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity Skeleton */}
                    <div className="bg-dashboard-bg/50 rounded-lg p-6">
                        <div className="space-y-4 mb-6">
                            <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
                            <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
                        </div>

                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-dashboard-border/50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                                            <div className="h-3 bg-gray-600 rounded w-32 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end items-end space-y-2">
                                        <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
                                        <div className="h-3 bg-gray-600 rounded w-16 animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Categories Skeleton */}
                    <div className="bg-dashboard-bg/50 rounded-lg p-6">
                        <div className="space-y-4 mb-6">
                            <div className="h-6 bg-gray-700 rounded w-36 animate-pulse"></div>
                            <div className="h-4 bg-gray-700 rounded w-52 animate-pulse"></div>
                        </div>

                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-600 rounded w-32 animate-pulse"></div>
                                    </div>
                                    <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;