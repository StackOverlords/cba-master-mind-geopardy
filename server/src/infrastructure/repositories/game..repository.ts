import { GameFilter } from "../../core/interfaces/game.filter.interface";
import { GameModel, IGame } from "../../core/models/Game.model";

export class GameRepository {
    async create(gameData: Partial<IGame>): Promise<IGame> {
        const game = new GameModel(gameData);
        return await game.save();
    }

    async findById(id: string): Promise<IGame | null> {
        return await GameModel.findById(id);
    }

    async findAll({ name, user, status, gameMode, players, isDeleted, questions, page = 1, limit = 10, sort = "desc" }: Partial<GameFilter>): Promise<any> {
        const pageNumber = Math.max(1, parseInt(page as any) || 1);
        const limitNumber = Math.max(1, parseInt(limit as any) || 10);

        const isUnlimited = limitNumber === -1;

        const filter: Record<string, any> = { isDeleted: false };

        if (name) filter.name = { $regex: name, $option: 'i' }
        if (user) filter.user = user;
        if (status) filter.status = status;
        if (gameMode) filter.gameMode = gameMode;

        const dataPipeline: any[] = [
            { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
        ]

        if (!isUnlimited) {
            dataPipeline.push(
                { $skip: (pageNumber - 1) * limitNumber },
                { $limit: limitNumber }
            )
        }

        const query = [
            {
                $match: filter
            },
            {
                $facet: {
                    data: dataPipeline,
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            },
            {
                $project: {
                    data: 1,
                    totalCount: { $arrayElemAt: ['$totalCount.count', 0] }
                }
            },

        ]

        const [result] = await GameModel.aggregate(query);

        const totalCount = result.totalCount || 0;
        const totalPages = Math.ceil(totalCount / limitNumber);

        return {
            page: pageNumber,
            limit: limitNumber,
            sort,
            totalPages,
            totalCount,
            data: result.data

        };
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