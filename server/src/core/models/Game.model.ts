import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
    name: string;
    user: mongoose.Types.ObjectId;
    gameMode: "championship" | 'playerVsPlayer';
    status: "waiting" | "playing" | "paused" | "finished";
    players: Array<{
        socketId: string; // ID del socket del jugador
        userId: string; // ID del jugador
        playerId: string;
        username: string;
        score: number; // Añadimos el puntaje persistente
        hasAnsweredThisTurn: boolean; // Indica si el jugador ha respondido en su turno
    }>; // Arreglo de jugadores con sus IDs y nombres, y sus puntajes
    questions: mongoose.Types.ObjectId[]; // IDs de las preguntas usadas en la partida
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;

    code: string; // Código del juego único
    currentRound: number; // El número de la ronda actual
    currentPlayerDbId: mongoose.Types.ObjectId | null | string; // ID del jugador en turno (para persistencia)
    finalResults?: {
        positions: { playerId: string; position: number, score: number }[]; // Posiciones finales de los jugadores
    };
}
const question = {
    type: mongoose.Types.ObjectId,
    ref: "Question"
}
const positions = {
    playerId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    position: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
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
        type: [{
            playerId: { type: Schema.Types.ObjectId, ref: "User" },
            username: { type: String, required: true },
            score: { type: Number, default: 0 },
        }],
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
    },
    code:{
        type: String,
        unique: true, // Asegura que el código del juego sea único
        required: false,
        trim: true,
    },
    finalResults:{
        type:[positions],
        required: false,
        default: []
    },
     currentRound: {
        type: Number,
        default: 0,
    },
    currentPlayerDbId: { // Para saber quién tiene el turno si la partida persiste
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
},
    {
        timestamps: true,
        versionKey: false,

    }
);

export const GameModel = mongoose.model<IGame>("Game", gameSchema);
