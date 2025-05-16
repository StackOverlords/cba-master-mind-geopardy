import { ICategory } from "../models/Category.model";

export interface CategoryFilter extends ICategory {
    page?: string | number,
    limit?: string | number,
    sort: 'asc' | 'desc'
}