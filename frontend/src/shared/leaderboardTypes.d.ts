export interface Player {
    id: number;
    position: number;
    name: string;
    avatar: string;
    points: number;
    isCurrentUser?: boolean;
  }
  
  export type TimeFilter = "month" | "allTime";
  