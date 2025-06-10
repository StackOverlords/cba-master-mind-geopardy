import PlayerRow from "./playerRow";
import { useAuthStore } from "../../../stores/authStore";
import type { ChampionShipPlayer } from "../../../shared/types/ChampionShipGame";

interface LeaderboardProps {
  players: ChampionShipPlayer[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const currentUserId = useAuthStore((state) => state.user?._id);

  // const displayData = activeFilter === "month" ? monthlyData : allTimeData;

  return (
    <div className="bg-gradient-to-br grow overflow-y-auto from-leaderboard-bg/60 to-black/30 rounded-xl shadow-xl border border-white/5 pt-3 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 relative px-5">
        <div className="text-sm sm:text-xl font-bold text-white">Rankings</div>
        {/* <TimeFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} /> */}
      </div>

      <section className="w-full border-separate border-spacing-y-1 border-spacing-x-0 px-5">
        <header className="flex items-center gap-2">
          <div className="text-left pl-4 py-3 text-xs sm:text-sm text-leaderboard-muted font-medium w-3/12">Position</div>
          <div className="text-left pl-2 py-3 text-xs sm:text-sm text-leaderboard-muted font-medium w-6/12">Player</div>
          <div className="text-right px-4 py-3 text-xs sm:text-sm text-leaderboard-muted font-medium w-3/12">Points</div>
        </header>
        <div className="mt-2 w-full">
          {players.map((player, idx) => (
            <PlayerRow
              key={player._id}
              player={player}
              isCurrentUser={player._id === currentUserId}
              position={idx + 1} />
          ))}
        </div>
      </section>
      <div className="sticky z-10 h-8 items-center justify-center bottom-0 w-full">
        <div className="bg-linear-to-b from-transparent to-black/50 backdrop-blur-sm mask-t-from-50% inset-0 absolute"></div>
      </div>
    </div>
  );
};

export default Leaderboard;