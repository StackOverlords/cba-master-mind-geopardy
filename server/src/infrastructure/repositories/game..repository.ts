import mongoose, { Types } from "mongoose";
import { GameBody, GameFilter } from "../../core/interfaces/game.filter.interface";
import { GameModel, IGame } from "../../core/models/Game.model";
import { QuestionModel } from "../../core/models/Question.Model";

export class GameRepository {
    async create(gameData: Partial<GameBody>): Promise<IGame> {
        const game = new GameModel(gameData);

        if (gameData.generateQuestions && gameData.categorys?.length) {

            const numPlayers = gameData.playersLocal?.length || 1;
            const numRounds = gameData.rounds || 1;
            const EXTRA_QUESTIONS_BUFFER = 5; // Un colchón de 5 preguntas adicionales. ¡Puedes ajustarlo!
            const totalQuestionsNeeded = (numPlayers * numRounds) + EXTRA_QUESTIONS_BUFFER;

            const allAvailableQuestions = await QuestionModel.find({
                isDeleted: false,
                categoryId: { $in: gameData.categorys }
            }).select('_id').lean();

            if (allAvailableQuestions.length < totalQuestionsNeeded) {
                throw new Error(`No hay suficientes preguntas. Se necesitan ${totalQuestionsNeeded} pero solo hay ${allAvailableQuestions.length} disponibles en las categorías seleccionadas. Intenta con menos rondas o más categorías.`);
            }
 
            const shuffledQuestions = allAvailableQuestions.sort(() => 0.5 - Math.random());

            const questionIds = shuffledQuestions
                .slice(0, totalQuestionsNeeded)
                .map(q => q._id);
            game.questions = questionIds as Types.ObjectId[];
        }

        return await game.save();
    };
    async findById(id: string): Promise<IGame | null> {
        return await GameModel.findById(id);
    }

    async findAll({
        id,
        name,
        user,
        status,
        gameMode,
        players,
        isDeleted,
        questions,
        page = 1,
        limit = 10,
        sort = "desc",
    }: Partial<GameFilter>): Promise<any> {
        const pageNumber = Math.max(1, parseInt(page as any) || 1);
        const limitNumber = parseInt(limit as any) || 10;
        const isUnlimited = limitNumber === -1;

        // Filtros base
        const filter: Record<string, any> = { isDeleted: isDeleted || false };
        if (id) filter._id = new mongoose.Types.ObjectId(id);
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (user) filter.user = user;
        if (status) filter.status = status;
        if (gameMode) filter.gameMode = gameMode;

        const basePipeline: any[] = [
            { $match: filter },
            { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
        ];

        const lookupsPipeline: any[] = [
            {
                $lookup: {
                    from: "questions",
                    localField: "questions",
                    foreignField: "_id",
                    as: "questions",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categorys",
                    foreignField: "_id",
                    as: "categorys",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        ];

        const dataPipeline = [
            ...basePipeline,
            ...lookupsPipeline,
            ...(!isUnlimited
                ? [
                    { $skip: (pageNumber - 1) * limitNumber },
                    { $limit: limitNumber },
                ]
                : []),
        ];

        const countPipeline = [
            ...basePipeline,
            { $count: "count" },
        ];

        const query = [
            {
                $facet: {
                    data: dataPipeline,
                    totalCount: countPipeline,
                },
            },
            {
                $project: {
                    data: 1,
                    totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                },
            },
        ];

        const [result] = await GameModel.aggregate(query);

        const totalCount = result.totalCount || 0;
        const totalPages = isUnlimited ? 1 : Math.ceil(totalCount / limitNumber);

        return {
            page: pageNumber,
            limit: isUnlimited ? totalCount : limitNumber,
            sort,
            totalPages,
            totalCount,
            data: result.data,
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

    async answerQuestion(
        gameId: string,
        questionId: mongoose.Types.ObjectId,
        answerData: {
            answer: string;
            isCorrect: boolean;
        }
    ): Promise<IGame | null> {
        return await GameModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(gameId) },
            {
                // $pull: { questions: questionId }, // Elimina la pregunta del arreglo `questions`
                $push: {
                    questionsLocalAnswered: {
                        questionId: questionId,
                        answer: answerData.answer,
                        isCorrect: answerData.isCorrect,
                    },
                },
            },
            { new: true } // Retorna el documento actualizado
        );
    }
}