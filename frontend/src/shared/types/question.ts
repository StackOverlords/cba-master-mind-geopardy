export interface Answer {
    _id: string
    text: string,
    isCorrect: boolean,
}
export interface Question {
    _id: string;
    categoryId: string;
    user: string;
    question: string;
    isDeleted: boolean;
    answers: Answer[]
}