import { GameModel, IGame } from "../../core/models/Game.model"; 

export class GameRepository {
    async create(gameData: Partial<IGame>): Promise<IGame> {
        const game = new GameModel(gameData);
        return await game.save();
    }

    async findById(id: string): Promise<IGame | null> {
        return await GameModel.findById(id);
    }

    async findAll(): Promise<IGame[]> {
        return await GameModel.find();
    }

    async update(id: string, gameData: Partial<IGame>): Promise<IGame | null> {
        return await GameModel.findOneAndUpdate({ _id: id }, gameData, { new: true });
    }

    async delete(id: string): Promise<IGame | null> {
        return await GameModel.findOneAndUpdate({ _id: id }, {
            isDeleted: true
        }, {
            new: true
        })
    }
}