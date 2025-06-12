import { motion } from "motion/react";
import Trophy from "../components/game/leaderboard/trophy";

const GameDashboard = () => {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-gradient-to-br backdrop-blur-md from-leaderboard-card/60 to-leaderboard-bg/60 p-4 rounded-xl shadow-lg mb-6 border border-white/5">
                    <div className="flex items-center gap-4 relative">
                        <div className="flex-shrink-0">
                            <Trophy />
                        </div>
                        <div className="flex flex-col items-center justify-center w-full">
                            <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P text-base sm:text-2xl font-extrabold text-center mb-2">MASTER MIND</h2>
                            <p className="text-xs sm:text-sm text-leaderboard-muted text-center text-wrap">
                                Test your intellect with our quiz platform. Test your knowledge in multiple categories and compete with your friends.
                            </p>
                        </div>
                    </div>
                </motion.header>

                {/* New Games Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">New Games</h3>
                        {/* <button
                            onClick={() => setShowAllGames(!showAllGames)}
                            className="text-purple-300 hover:text-white transition-colors"
                        >
                            {showAllGames ? "Show Less" : "See More"}
                        </button> */}
                    </div>

                    
                </section>


            </div>
        </main>
    );
}

export default GameDashboard;