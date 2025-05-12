import { ICategory, CategoryModel } from "../../core/models/Category.model";

export class CategoryRepository {

    async create(categoryData: Partial<ICategory>): Promise<ICategory | null> {
        const category = new CategoryModel(categoryData);
        return await category.save();
    }

    async findById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id);
    }

    async findAll(): Promise<ICategory[] | null> {
        return await CategoryModel.find();
    }

    async update(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        return await CategoryModel.findOneAndUpdate({ _id: id }, categoryData, { new: true })
    }

    async delete(id: string): Promise<ICategory | null> {
        return await CategoryModel.findOneAndUpdate({ _id: id }, {
            isDeleted: true
        }, {
            new: true
        })
    }

    async findByText(name: string): Promise<ICategory[] | null> {
        return await CategoryModel.aggregate([
            {
                $match: {
                    name: {
                        $regex: name
                    }
                }
            }
        ])
    }
}