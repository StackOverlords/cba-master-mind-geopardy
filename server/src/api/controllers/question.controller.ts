import { Request, Response } from "express";
import { QuestionService } from "../../core/services/question.service";
import { asyncHandler } from "../middlewares/async.middleware";

export class QuestionController {
    private questionService: QuestionService;

    constructor() {
        this.questionService = new QuestionService();
    }

    createQuestion = asyncHandler(async (req: Request, res: Response) => {
        const question = await this.questionService.createQuestion(req.body);
        res.status(201).json(question);
    })

    findAll = asyncHandler(async (req: Request, res: Response) => {
        const queston = await this.questionService.findAll();
        res.status(201).json(queston);
    })

    findById = asyncHandler(async (req: Request, res: Response) => {
        const question = await this.questionService.findById(req.params.id);
        res.status(201).json(question);
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const question = await this.questionService.update(req.params.id, req.body);
        res.status(201).json(question);
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        await this.questionService.delete(req.params.id);
        res.status(201).json({ message: "Question deleted successfully" })
    })
}