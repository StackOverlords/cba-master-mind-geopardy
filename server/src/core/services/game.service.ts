import { GameRepository } from "../../infrastructure/repositories/game..repository";
import { IGame } from "../models/Game.model";
import { CustomError } from "../../api/middlewares/error.middleware";
import { GameFilter } from "../interfaces/game.filter.interface";

export class GameService {
    private gameRepository: GameRepository;

    constructor() {
        this.gameRepository = new GameRepository();
    }

    async createGame(gameData: Partial<IGame>): Promise<IGame | null> {
        return await this.gameRepository.create(gameData);
    }
    
    async findAll({name,user,status,gameMode,players,isDeleted,questions,page,limit,sort}:Partial<GameFilter>):Promise<IGame[] | null>{
        return await this.gameRepository.findAll({name,user,status,gameMode,players,isDeleted,questions,page,limit,sort});
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