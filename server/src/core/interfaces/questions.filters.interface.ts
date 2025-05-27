import { IQuestion } from "../models/Question.Model"; 

export interface QuestionsFilters extends IQuestion {
    page?: string | number,
    limit?: string | number,
    sort: 'asc' | 'desc'
}