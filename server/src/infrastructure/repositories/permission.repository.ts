import { PermissionFilter } from "../../core/interfaces/permisson.filter.interface";
import { IPermission, PermissionModel } from "../../core/models/Permisson.model";

export class PermissionRepository {

    async create(permissionData: Partial<IPermission>): Promise<IPermission | null> {
        const permission = new PermissionModel(permissionData);
        return await permission.save();
    }

    async findAll({ code, description, page = 1, limit = 10, sort = "desc" }: Partial<PermissionFilter>): Promise<any> {
        const pageNumber = Math.max(1, parseInt(page as any) || 1);
        const limitNumber = parseInt(limit as any) || 10;


        const isUnlimited = limitNumber === -1;

        const filter: Record<string, any> = { isDeleted: false };

        if (code) filter.code = code;
        if (description) filter.description = { $regex: description, $options: 'i' };

        const basePipeline: any[] = [
            { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },

        ];

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

        const [result] = await PermissionModel.aggregate(query);

        const totalCount = result.totalCount || 0;
        const totalPages = isUnlimited ? 1 : Math.ceil(totalCount / limitNumber);


        return {
            page: pageNumber,
            limit: isUnlimited ? totalCount : limitNumber, // Mostrar total cuando es -1
            sort,
            totalPages,
            totalCount,
            data: result.data
        };
    }

    async update(id: string, permissionData: Partial<IPermission>): Promise<IPermission | null> {
        return await PermissionModel.findOneAndUpdate({
            _id: id
        }, permissionData, { new: true });
    }

    async findByCode(code: string): Promise<boolean> {
        const exist = await PermissionModel.exists({ code: code });
        return exist ? true : false;
    }

    async findById(id: string): Promise<IPermission | null> {
        return await PermissionModel.findById(id);
    }

    async delete(id: string): Promise<IPermission | null> {
        return await PermissionModel.findOneAndUpdate({ _id: id }, {
            isDeleted: true
        }, {
            new: true
        })
    }
}