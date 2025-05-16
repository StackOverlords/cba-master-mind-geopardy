import { CustomError } from "../../api/middlewares/error.middleware";
import { PermissionRepository } from "../../infrastructure/repositories/permission.repository";
import { PermissionFilter } from "../interfaces/permisson.filter.interface";
import { IPermission } from "../models/Permisson.model";

export class PermissionService {
    private permissionRepository: PermissionRepository;

    constructor() {
        this.permissionRepository = new PermissionRepository();
    }

    async create(permissionData: Partial<IPermission>): Promise<IPermission | null> {
        if (!permissionData.code) {
            throw new CustomError("The information is incomplete", 400);
        }
        const exist = await this.permissionRepository.findByCode(permissionData.code)
        if (exist) {
            throw new CustomError("The permit already exists", 400);
        }
        return await this.permissionRepository.create(permissionData);
    }

    async findAll({ code, description, page, limit, sort }: Partial<PermissionFilter>): Promise<IPermission[] | null> {
        return await this.permissionRepository.findAll({ code, description, page, limit, sort });
    }

    async update(id: string, permissionData: Partial<IPermission>): Promise<IPermission | null> {
        const exist = await this.permissionRepository.findById(id);
        if (!exist) {
            throw new CustomError("Permission not exist", 400);
        }
        return await this.permissionRepository.update(id, permissionData);
    }

    async delete(id: string): Promise<IPermission | null> {
        const exist = await this.permissionRepository.findById(id);
        if (!exist) {
            throw new CustomError("Permission not exist", 400);
        }
        return await this.permissionRepository.delete(id);
    }
}