import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion extends Document {
    categoryId: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    question: string;
    isDeleted:boolean;
    answers: object[]
};
const answer = {
    text: String,
    isCorrect: Boolean,
}
const questionSchema = new Schema<IQuestion>({
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default:false
    },
    answers: {
        type: [answer],
        required: false
    }
});

export const QuestionModel = mongoose.model<IQuestion>("Question", questionSchema)