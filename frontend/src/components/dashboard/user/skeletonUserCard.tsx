const SkeletonUserCard = () => {
    return (
        <section className="grid sm:grid-cols-2 items-center p-4 rounded-lg bg-dashboard-border/50 animate-pulse">
            {/* Avatar y texto */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-700" />
                <div>
                    <div className="h-4 w-32 bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-48 bg-slate-700 rounded" />
                </div>
            </div>

            {/* Rol y acciones */}
            <div className="flex items-center justify-end gap-6">
                <div className="h-6 w-16 rounded-full bg-slate-700" />
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-md bg-slate-700" />
                </div>
            </div>
        </section>
    );
}

export default SkeletonUserCard;