import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
    name: string;
    user: mongoose.Types.ObjectId;
    gameMode: "championship" | 'playerVsPlayer';
    status: "waiting" | "playing" | "paused" | "finished";
    players: object[];
    questions: object[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const question = {
    type: mongoose.Types.ObjectId,
    ref: "Question"
}
const gameSchema = new Schema<IGame>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["waiting", "playing", "paused", "finished"],
        default: "waiting",
    },
    gameMode: {
        type: String,
        // championship=tablero, playerVsPlayer=varios jugadores con cuenta
        enum: ["championship", "playerVsPlayer"]
    },
    players: {
        type: [Object],
        default: [],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },
    questions: {
        type: [question],
        default: [],
    }
},
    {
        timestamps: true,
        versionKey: false,

    }
);

export const GameModel = mongoose.model<IGame>("Game", gameSchema);
