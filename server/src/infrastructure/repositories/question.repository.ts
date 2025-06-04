import mongoose from "mongoose";
import { QuestionsFilters } from "../../core/interfaces/questions.filters.interface";
import { IQuestion, QuestionModel } from "../../core/models/Question.Model";
import { GameModel } from "../../core/models/Game.model";
import { CustomError } from "../../api/middlewares/error.middleware";
export class QuestionRepository {
    async create(questioData: Partial<IQuestion>): Promise<IQuestion | null> {
        const question = new QuestionModel(questioData);
        return await question.save();
    }

    async getById(id: string): Promise<IQuestion | null> {
        return await QuestionModel.findById(id);
    }

    async findAll({ categoryId, user, question, page = 1, limit = 10, sort = "desc" }: Partial<QuestionsFilters>): Promise<any> {
        const pageNumber = Math.max(1, parseInt(page as any) || 1);
        const limitNumber = parseInt(limit as any) || 10; // Quitamos Math.max(1, ...) para permitir -1

        const isUnlimited = limitNumber === -1;

        const filter: Record<string, any> = { isDeleted: false };
        if (categoryId) filter.categoryId = new mongoose.Types.ObjectId(categoryId);
        if (user) filter.user = user;
        if (question) filter.question = { $regex: question, $options: 'i' };

        // Pipeline base que aplica el filtro y ordenación
        const basePipeline: any[] = [
            { $match: filter },
            { $sort: { createdAt: sort === 'desc' ? -1 : 1 } }
        ];

        // Pipeline para los datos - añadimos limitación si no es unlimited
        const dataPipeline = [...basePipeline];
        if (!isUnlimited) {
            dataPipeline.push(
                { $skip: (pageNumber - 1) * limitNumber },
                { $limit: limitNumber }
            );
        }

        const query = [
            {
                $facet: {
                    data: dataPipeline,
                    totalCount: [
                        { $match: filter },
                        { $count: 'count' }
                    ]
                }
            },
            {
                $project: {
                    data: 1,
                    totalCount: { $arrayElemAt: ['$totalCount.count', 0] }
                }
            }
        ];

        const [result] = await QuestionModel.aggregate(query);

        const totalCount = result.totalCount || 0;
        const totalPages = isUnlimited ? 1 : Math.ceil(totalCount / limitNumber);
        return {
            page: pageNumber,
            limit: isUnlimited ? totalCount : limitNumber, // Mostrar el total como limit cuando es -1
            sort,
            totalPages,
            totalCount,
            data: result.data
        };
    }

    async update(id: string, questionData: Partial<IQuestion>): Promise<IQuestion | null> {
        return await QuestionModel.findOneAndUpdate({ _id: id }, questionData, { new: true });
    }

    async delete(id: string): Promise<IQuestion | null> {
        return await QuestionModel.findOneAndUpdate({ _id: id }, {
            isDeleted: true
        }, {
            new: true
        })
    }
    async findByQuestionText(text: string): Promise<IQuestion | null> {
        return await QuestionModel.findOne({
            question: text
        })
    }

    async createMany(questions: IQuestion[]): Promise<IQuestion[] | null> {
        return await QuestionModel.insertMany(questions);
    } 
}