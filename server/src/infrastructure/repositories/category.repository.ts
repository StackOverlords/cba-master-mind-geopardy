import { CategoryFilter } from "../../core/interfaces/category.filter.interface";
import { ICategory, CategoryModel } from "../../core/models/Category.model";

export class CategoryRepository {

    async create(categoryData: Partial<ICategory>): Promise<ICategory | null> {
        const category = new CategoryModel(categoryData);
        return await category.save();
    }

    async findById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id);
    }

    async findAll({ name, user, description, page = 1, limit = 10, sort = "desc" }: Partial<CategoryFilter>): Promise<any> {
        const pageNumber = Math.max(1, parseInt(page as any) || 1);
        const limitNumber = parseInt(limit as any) || 10;

        const isUnlimited = limitNumber === -1;

        const filter: Record<string, any> = { isDeleted: false };

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (user) filter.user = user;
        if (description) filter.description = { $regex: description, $options: 'i' };

        const basePipeline: any[] = [
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "categoryId",
                    pipeline: [
                        { $match: { isDeleted: false } }
                    ],
                    as: "questions"
                }
            },
            {
                $addFields: {
                    questionCount: { $size: "$questions" }
                }
            },
            { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
            {
                $project: {
                    questions: 0
                }
            }
        ];

        const dataPipeline = [...basePipeline];
        if (!isUnlimited) {
            dataPipeline.push(
                { $skip: (pageNumber - 1) * limitNumber },
                { $limit: limitNumber }
            );
        }

        const query = [
            { $match: filter },
            {
                $facet: {
                    data: dataPipeline,
                    totalCount: [
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

        const [result] = await CategoryModel.aggregate(query);

        const totalCount = result.totalCount || 0;
        const totalPages = isUnlimited ? 1 : Math.ceil(totalCount / limitNumber);

        return {
            page: pageNumber,
            limit: isUnlimited ? totalCount : limitNumber,
            sort,
            totalPages,
            totalCount,
            data: result.data
        };
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