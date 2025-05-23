import React from "react";
import Laurel1Icon from "../../ui/icons/laurel1Icon";
import Laurel2Icon from "../../ui/icons/laurel2Icon";
import Laurel3Icon from "../../ui/icons/laurel3Icon";

interface PositionBadgeProps {
  position: number;
}

const PositionBadge: React.FC<PositionBadgeProps> = ({ position }) => {
  const getBadgeIcon = () => {
    switch (position) {
      case 1:
        return <Laurel1Icon className="size-7" />
      case 2:
        return <Laurel2Icon className="size-7" />
      case 3:
        return <Laurel3Icon className="size-7" />
      default:
        return "bg-leaderboard-card text-gray-400";
    }
  };

  return (
    <>
      {
        getBadgeIcon()
      }
    </>
  );
};

export default PositionBadge;