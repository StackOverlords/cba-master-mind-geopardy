import PositionBadge from "./positionBadge";
import { motion } from "motion/react";
import type { ChampionShipPlayer } from "../../../shared/types/ChampionShipGame";

interface PlayerRowProps {
  player: ChampionShipPlayer;
  position: number;
  isCurrentUser: boolean;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, isCurrentUser, position }) => {
  const { username, avatar, score } = player;

  const getRowStyle = () => {
    if (isCurrentUser) return "bg-gradient-to-r from-leaderboard-user-row via-leaderboard-highlight/10 to-leaderboard-highlight/10 relative rounded-md mb-1";

    if (position <= 3 && score > 0) {
      let positionClass: string
      if (position === 1) positionClass = 'bg-gradient-to-r from-leaderboard-gold/20'
      else if (position === 2) positionClass = 'bg-gradient-to-r from-leaderboard-silver/20'
      else positionClass = 'bg-gradient-to-r from-leaderboard-bronze/20'
      return `${positionClass} to-leaderboard-highlight/10 relative rounded-md mb-1 via-leaderboard-highlight/10`;
    }

    return "hover:bg-leaderboard-row-hover transition-colors duration-200 rounded-md mb-1 relative";
  };

  // Function to render the position indicator
  const renderPositionIndicator = () => {
    if (position <= 3 && score > 0) {
      const positionClass = position === 1
        ? "position-gold"
        : position === 2
          ? "position-silver"
          : "position-bronze";

      return <div className={`absolute position-indicator ${positionClass}`} />;
    }

    if (isCurrentUser) {
      return <div className="absolute position-indicator position-user" />;
    }

    return null;
  };

  return (
    <motion.div
      layout
      layoutId={`player-${player._id}`}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
      className={`${getRowStyle()} w-full flex items-center text-xs sm:text-sm py-2`}>
      <div className="w-3/12">
        {renderPositionIndicator()}
        <div className="flex items-center justify-center">
          {position <= 3 && score > 0 ? (
            <PositionBadge position={position} />
          ) : (
            <span className="text-leaderboard-muted text-center w-9">{position}</span>
          )}
        </div>
      </div>
      <div className="pl-2 w-6/12">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="size-8 rounded-full overflow-hidden bg-leaderboard-highlight flex-shrink-0 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <span className={`font-medium truncate sm:text-wrap xl:truncate ${isCurrentUser ? "text-white" : ""}`}>
            {username}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-blue-300">(You)</span>
            )}
          </span>
        </div>
      </div>
      <div className="px-4 text-right font-mono font-medium w-3/12">
        {score.toLocaleString()}
      </div>
    </motion.div>
  );
};

export default PlayerRow;