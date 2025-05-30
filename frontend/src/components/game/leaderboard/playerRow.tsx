import React from "react";
import type { Player } from "../../../shared/leaderboardTypes";
import PositionBadge from "./positionBadge";

interface PlayerRowProps {
  player: Player;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player }) => {
  const { position, name, avatar, points, isCurrentUser } = player;

  const getRowStyle = () => {
    if (isCurrentUser) return "bg-gradient-to-r from-leaderboard-user-row via-leaderboard-highlight/10 to-leaderboard-highlight/10 relative rounded-md mb-1";

    if (position <= 3) {
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
    if (position <= 3) {
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
    <tr className={`${getRowStyle()}`}>
      <td className="py-3 pl-4">
      {renderPositionIndicator()}
        <div className="flex items-center justify-center">
          {position <= 3 ? (
            <PositionBadge position={position} />
          ) : (
            <span className="text-leaderboard-muted text-center w-9">{position}</span>
          )}
        </div>
      </td>
      <td className="py-3 pl-2">
        <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={name}
              className="size-8 rounded-full overflow-hidden bg-leaderboard-highlight flex-shrink-0 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          <span className={`font-medium ${isCurrentUser ? "text-white" : ""}`}>
            {name}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-blue-300">(You)</span>
            )}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-right font-mono font-medium">
        {points.toLocaleString()}
      </td>
    </tr>
  );
};

export default PlayerRow;