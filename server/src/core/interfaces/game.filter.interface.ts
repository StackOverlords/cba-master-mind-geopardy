import { IGame } from "../models/Game.model";

export interface GameFilter extends IGame {
    id: string;
    page?: string | number;
    limit?: string | number;
    sort: 'asc' | 'desc';
}

export interface GameBody extends IGame {
    generateQuestions?: boolean;
}