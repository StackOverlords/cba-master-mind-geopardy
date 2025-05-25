import React from "react";
import type { TimeFilter as TimeFilterType} from "../../../shared/leaderboardTypes";

interface TimeFilterProps {
  activeFilter: TimeFilterType;
  onFilterChange: (filter: TimeFilterType) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex bg-leaderboard-card rounded-lg p-1 mb-6 w-fit">
      <button
        className={`px-4 py-2 rounded-md transition-all duration-200 ${
          activeFilter === "month"
            ? "bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md"
            : "text-leaderboard-muted hover:text-white"
        }`}
        onClick={() => onFilterChange("month")}
      >
        For month
      </button>
      <button
        className={`px-4 py-2 rounded-md transition-all duration-200 ${
          activeFilter === "allTime"
            ? "bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md"
            : "text-leaderboard-muted hover:text-white"
        }`}
        onClick={() => onFilterChange("allTime")}
      >
        All time
      </button>
    </div>
  );
};

export default TimeFilter;