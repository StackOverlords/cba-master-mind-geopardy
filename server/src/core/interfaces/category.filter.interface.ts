import { ICategory } from "../models/Category.model";

export interface CategoryFilter extends ICategory {
    id?:string,
    page?: string | number,
    limit?: string | number,
    sort: 'asc' | 'desc'
}