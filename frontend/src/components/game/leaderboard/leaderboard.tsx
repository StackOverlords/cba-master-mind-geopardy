import LeaderboardHeader from "./leaderboardHeader";
import PlayerRow from "./playerRow";
import type { Player } from "../../../shared/types/game";
import { useAuthStore } from "../../../stores/authStore";

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const currentUserId = useAuthStore((state) => state.user?._id);

  // const displayData = activeFilter === "month" ? monthlyData : allTimeData;

  return (
    <div className="max-w-sm sm:max-w-full lg:max-w-sm">
      <LeaderboardHeader />


      <div className="bg-gradient-to-br from-leaderboard-bg/60 to-black/30 rounded-xl overflow-hidden shadow-xl border border-white/5 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold text-white">Rankings</div>
          {/* <TimeFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} /> */}
        </div>

        <section className="w-full border-separate border-spacing-y-1 border-spacing-x-0">
          <header className="flex items-center gap-2">
            <div className="text-left pl-4 py-3 text-sm text-leaderboard-muted font-medium w-3/12">Position</div>
            <div className="text-left pl-2 py-3 text-sm text-leaderboard-muted font-medium w-6/12">Player</div>
            <div className="text-right px-4 py-3 text-sm text-leaderboard-muted font-medium w-3/12">Points</div>
          </header>
          <div className="mt-2 w-full">
            {players.map((player, idx) => (
              <PlayerRow
                key={player._id}
                player={player}
                isCurrentUser={player.playerId === currentUserId}
                position={idx + 1} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leaderboard;