import { IGame } from "../models/Game.model";

export interface GameFilter extends IGame {
    page?: string | number;
    limit?: string | number;
    sort: 'asc' | 'desc';
}