import React, { useState } from "react";
import type { Player, TimeFilter as TimeFilterType } from "../../../shared/leaderboardTypes";
import LeaderboardHeader from "./leaderboardHeader";
import TimeFilter from "./timeFilter";
import PlayerRow from "./playerRow";

interface LeaderboardProps {
  monthlyData: Player[];
  allTimeData: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ monthlyData, allTimeData }) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilterType>("month");

  const handleFilterChange = (filter: TimeFilterType) => {
    setActiveFilter(filter);
  };

  const displayData = activeFilter === "month" ? monthlyData : allTimeData;

  return (
    <div className="max-w-sm sm:max-w-full lg:max-w-sm">
      <LeaderboardHeader />


      <div className="bg-gradient-to-br from-leaderboard-bg/60 to-black/30 rounded-xl overflow-hidden shadow-xl border border-white/5 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold text-white">Rankings</div>
          {/* <TimeFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} /> */}
        </div>

        <table className="w-full border-separate border-spacing-y-1 border-spacing-x-0">
          <thead>
            <tr className="bg-transparent">
              <th className="text-left pl-4 py-3 text-sm text-leaderboard-muted font-medium">Position</th>
              <th className="text-left pl-2 py-3 text-sm text-leaderboard-muted font-medium">Player</th>
              <th className="text-right px-4 py-3 text-sm text-leaderboard-muted font-medium">Points</th>
            </tr>
          </thead>
          <tbody className="mt-2">
            {displayData.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;