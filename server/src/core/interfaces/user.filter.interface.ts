import { IUser } from "../models/User.model";

export interface UserFilter extends IUser {
    page?: string | number,
    limit?: string | number,
    sort: 'asc' | 'desc'
}