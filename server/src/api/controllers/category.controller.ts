import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { CategoryService } from "../../core/services/category.service";

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    createCategory = asyncHandler(async (req: Request, res: Response) => {
        const category = await this.categoryService.createCategory(req.body);
        res.status(201).json(category);
    })

    findAll = asyncHandler(async (_: Request, res: Response) => {
        const categorys = await this.categoryService.findAll();
        res.status(201).json(categorys);
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const category = await this.categoryService.update(req.params.id, req.body);
        res.status(201).json(category);
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const category = await this.categoryService.delete(req.params.id);
        res.status(201).json(category);
    })
}