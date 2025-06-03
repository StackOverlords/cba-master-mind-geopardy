import { GameRepository } from "../../infrastructure/repositories/game..repository";
import { IGame } from "../models/Game.model";
import { CustomError } from "../../api/middlewares/error.middleware";
import { GameBody, GameFilter } from "../interfaces/game.filter.interface";

export class GameService {
    private gameRepository: GameRepository;

    constructor() {
        this.gameRepository = new GameRepository();
    }

    async createGame(gameData: Partial<GameBody>): Promise<IGame | null> {
        return await this.gameRepository.create(gameData);
    }

    async answerQuestion(gameData: any): Promise<IGame | null> {
        const game = await this.gameRepository.findById(gameData.gameId!);
        if (!game) {
            throw new CustomError('Game not found', 404);
        }
        const { gameId, questionId, answerData } = gameData;
        return await this.gameRepository.answerQuestion( gameId, questionId, answerData);
    }

    async findAll({id,name,user,status,gameMode,players,isDeleted,questions,page,limit,sort}:Partial<GameFilter>):Promise<IGame[] | null>{
        return await this.gameRepository.findAll({id,name,user,status,gameMode,players,isDeleted,questions,page,limit,sort});
    }

    async findById(id: string): Promise<IGame | null> {
        return await this.gameRepository.findById(id);
    }

    async updateGame(id: string, gameData: Partial<IGame>): Promise<IGame | null> {
        const game = await this.gameRepository.findById(id);
        if (!game) {
            throw new CustomError('Game not found', 404);
        }
        return await this.gameRepository.update(id, gameData);
    }

    async deleteGame(id:string):Promise<IGame | null>{
        const game = this.gameRepository.findById(id);
        if(!game){
            throw new CustomError('Game not found',404);
        }
        return await this.gameRepository.delete(id);
    }
}