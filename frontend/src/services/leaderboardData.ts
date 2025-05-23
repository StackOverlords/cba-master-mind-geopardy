import type { Player } from "../shared/leaderboardTypes";

// Helper to generate random avatars
const getRandomAvatar = (seed: number): string => {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
};

// Monthly leaderboard data
export const monthlyLeaderboardData: Player[] = [
  {
    id: 1,
    position: 1,
    name: "Darlene",
    avatar: getRandomAvatar(1),
    points: 7791,
  },
  {
    id: 2,
    position: 2,
    name: "Darlene",
    avatar: getRandomAvatar(2),
    points: 9374,
  },
  {
    id: 3,
    position: 3,
    name: "Kyle",
    avatar: getRandomAvatar(3),
    points: 1439,
  },
  {
    id: 4,
    position: 4,
    name: "Arlene",
    avatar: getRandomAvatar(4),
    points: 9359,
  },
  {
    id: 5,
    position: 5,
    name: "Dianne",
    avatar: getRandomAvatar(5),
    points: 2798,
  },
  {
    id: 6,
    position: 6,
    name: "Arlene",
    avatar: getRandomAvatar(6),
    points: 4349,
  },
  // Add more players as needed
  {
    id: 25,
    position: 25,
    name: "Aubrey",
    avatar: getRandomAvatar(25),
    points: 4152,
    isCurrentUser: true,
  },
];

// All time leaderboard data
export const allTimeLeaderboardData: Player[] = [
  {
    id: 101,
    position: 1,
    name: "Kyle",
    avatar: getRandomAvatar(101),
    points: 23865,
  },
  {
    id: 102,
    position: 2,
    name: "Marcus",
    avatar: getRandomAvatar(102),
    points: 19742,
  },
  {
    id: 103,
    position: 3,
    name: "Jenny",
    avatar: getRandomAvatar(103),
    points: 18521,
  },
  {
    id: 104,
    position: 4,
    name: "Arlene",
    avatar: getRandomAvatar(104),
    points: 17842,
  },
  {
    id: 105,
    position: 5,
    name: "Dianne",
    avatar: getRandomAvatar(105),
    points: 16321,
  },
  {
    id: 106,
    position: 6,
    name: "Brandon",
    avatar: getRandomAvatar(106),
    points: 15987,
  },
  // Add more players as needed
  {
    id: 125,
    position: 32,
    name: "Aubrey",
    avatar: getRandomAvatar(125),
    points: 9876,
    isCurrentUser: true,
  },
];