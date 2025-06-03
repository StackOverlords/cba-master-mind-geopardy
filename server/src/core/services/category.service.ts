import { CategoryRepository } from "../../infrastructure/repositories/category.repository";
import { ICategory } from "../models/Category.model";
import { CustomError } from "../../api/middlewares/error.middleware";
import { CategoryFilter } from "../interfaces/category.filter.interface";

export class CategoryService {
    private categoryService: CategoryRepository;

    constructor() {
        this.categoryService = new CategoryRepository();
    }

    async createCategory(categoryData: Partial<ICategory>): Promise<ICategory | null> {
        if (!categoryData.name) {
            throw new CustomError("Category name is required", 400);
        }

        // Buscar todas las categorías con el mismo nombre (incluyendo eliminadas)
        const existingCategories = await this.categoryService.findByText(categoryData.name); 
        
        const activeCategory = existingCategories?.find(cat => cat.isDeleted === false);
        if (activeCategory) {
            throw new CustomError("Category already exists", 400);
        }

        // Si llegamos aquí, o no existe la categoría o está eliminada (isDeleted: true)
        return await this.categoryService.create(categoryData);
    }

    async findAll({ name, user, description, page, limit, sort }: Partial<CategoryFilter>): Promise<ICategory[] | null> {
        return await this.categoryService.findAll({ name, user, description, page, limit, sort });
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