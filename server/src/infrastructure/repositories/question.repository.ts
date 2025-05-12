import { IQuestion, QuestionModel } from "../../core/models/Question.Model";

export class QuestionRepository {
    async create(questioData: Partial<IQuestion>): Promise<IQuestion | null> {
        const question = new QuestionModel(questioData);
        return await question.save();
    }

    async getById(id: string): Promise<IQuestion | null> {
        return await QuestionModel.findById(id);
    }

    async findAll(): Promise<IQuestion[] | null> {
        return await QuestionModel.find();
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
}