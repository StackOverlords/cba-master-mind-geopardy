import { IPermission } from "../models/Permisson.model";

export interface PermissionFilter extends IPermission {
    page?: string | number,
    limit?: string | number,
    sort: 'asc' | 'desc'
}