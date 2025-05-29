import type { Answer } from "./question";

export interface CreateQuestionDto {
    categoryId: string;
    user: string;
    question: string;
    answers: Omit<Answer, '_id'>[];
}
export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {
    _id?: string;
}