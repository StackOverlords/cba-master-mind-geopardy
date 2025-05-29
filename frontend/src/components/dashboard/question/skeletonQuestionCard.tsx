export default function SkeletonQuestionCard() {
    return (
        <article className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden animate-pulse">
            <div className="flex items-start p-4">
                <div className="flex-1 w-full">
                    {/* Header */}
                    <header className="flex items-center justify-between gap-3 mb-2">
                        <span className="inline-block h-4 w-24 rounded-full bg-purple-500/20"></span>
                        <div className="flex items-center gap-2">
                            {[...Array(3)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="w-8 h-8 rounded-md bg-dashboard-border/50"
                                ></div>
                            ))}
                        </div>
                    </header>

                    {/* Pregunta */}
                    <div className="h-5 bg-muted/20 rounded w-3/4 mb-2"></div>

                    {/* Respuesta */}
                    <footer className="text-sm text-muted-foreground mb-2">
                        <div className="h-4 bg-muted/10 rounded w-1/2"></div>
                    </footer>
                </div>
            </div>
        </article>
    );
}
