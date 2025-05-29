export default function CategoryCardSkeleton() {
    return (
        <div className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden animate-pulse">
            <div className="p-4 border-b border-dashboard-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div>
                            <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-purple-800/30 rounded w-24"></div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-slate-700 rounded-md" />
                        <div className="w-8 h-8 bg-slate-700 rounded-md" />
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6 mb-4"></div>
                <div className="w-32 h-8 bg-purple-400/30 rounded-md" />
            </div>
        </div>
    );
}
