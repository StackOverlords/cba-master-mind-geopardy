import { QuestionRepository } from "../../infrastructure/repositories/question.repository";
import { CustomError } from "../../api/middlewares/error.middleware";
import { IQuestion } from "../models/Question.Model";

export class QuestionService {
    private questionRepository: QuestionRepository;

    constructor() {
        this.questionRepository = new QuestionRepository();
    }

    async createQuestion(questionData: IQuestion): Promise<IQuestion | null> {
        const exist = await this.questionRepository.findByQuestionText(questionData?.question);
        if (exist) {
            throw new CustomError("Question already exist", 400)
        }
        return await this.questionRepository.create(questionData);
    }

    async findAll(): Promise<IQuestion[] | null> {
        return await this.questionRepository.findAll();
    }

    async findById(id: string): Promise<IQuestion | null> {
        return await this.questionRepository.getById(id);
    }

    async update(id: string, questionData: Partial<IQuestion>): Promise<IQuestion | null> {
        const exist = await this.questionRepository.getById(id);
        if (!exist) {
            throw new CustomError("Question not found", 404);
        }
        return await this.questionRepository.update(id, questionData);
    }

    async delete(id: string): Promise<IQuestion | null> {
        return await this.questionRepository.delete(id);
    }
}