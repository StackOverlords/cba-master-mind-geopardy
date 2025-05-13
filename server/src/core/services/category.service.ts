import { CategoryRepository } from "../../infrastructure/repositories/category.repository";
import { CategoryModel, ICategory } from "../models/Category.model";
import { CustomError } from "../../api/middlewares/error.middleware";

export class CategoryService {
    private categoryService: CategoryRepository;

    constructor() {
        this.categoryService = new CategoryRepository();
    }

    async createCategory(categoryData: Partial<ICategory>): Promise<ICategory | null> {
        if (!categoryData.name) {
            throw new CustomError("Category name is required", 400);
        }
        const exist = await this.categoryService.findByText(categoryData.name);
        if (exist && exist.length >= 0) {
            throw new CustomError("Category already exists", 400);
        }
        return await this.categoryService.create(categoryData);
    }

    async findAll(): Promise<ICategory[] | null> {
        return await this.categoryService.findAll();
    }

    async findById(id: string): Promise<ICategory | null> {
        return await this.categoryService.findById(id);
    }

    async update(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        const exist = await this.categoryService.findById(id);
        if (!exist) {
            throw new CustomError("Category not found", 404);
        }
        return await this.categoryService.update(id, categoryData)
    }

    async delete(id: string): Promise<ICategory | null> {
        const exist = await this.categoryService.findById(id);
        if (!exist) {
            throw new CustomError("Category not found", 404);
        }
        return await this.categoryService.delete(id);
    }
}