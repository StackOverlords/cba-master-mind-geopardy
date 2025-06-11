import React from "react";
import Trophy from "./trophy";

const LeaderboardHeader: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-br backdrop-blur-md from-leaderboard-card/60 to-leaderboard-bg/60 p-4 rounded-xl shadow-lg mb-6 border border-white/5">
      <div className="flex items-center gap-4 relative">
        <div className="flex-shrink-0">
          <Trophy />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center">
                <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P text-base sm:text-lg font-extrabold text-center">MASTER MIND</h2>
            </div>
          </div>
          {/* <p className="text-sm text-leaderboard-muted">
            Demonstrate your knowledge by answering the questions.
          </p> */}
          <p className="text-xs sm:text-sm text-leaderboard-muted text-center">
            Earn points and climb the rankings in this game!
          </p>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardHeader;