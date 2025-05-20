import { QuestionRepository } from "../../infrastructure/repositories/question.repository";
import { CustomError } from "../../api/middlewares/error.middleware";
import { IQuestion } from "../models/Question.Model";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { CategoryRepository } from "../../infrastructure/repositories/category.repository";

export class QuestionService {
    private questionRepository: QuestionRepository;
    private userRepository: UserRepository;
    private categoryRepository: CategoryRepository;
    constructor() {
        this.questionRepository = new QuestionRepository();
        this.userRepository = new UserRepository();
        this.categoryRepository = new CategoryRepository();
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
    async createManyQuestions(questions: IQuestion[], uid: string, categoryExtract: string): Promise<IQuestion[] | null> {
        const exist = await this.questionRepository.findByQuestionText(questions[0]?.question);
        const user = await this.userRepository.findByFirebaseUUID(uid);
        const category = await this.categoryRepository.findByText(categoryExtract);
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        if (exist) {
            throw new CustomError("Question already exist", 400)
        }
        if (!category) {
            throw new CustomError("Category not found", 404);
        }
        questions.forEach((question) => {
            question.user = user?._id as any;
            question.categoryId = category[0]?._id as any;
        });
        return await this.questionRepository.createMany(questions);
    }
}