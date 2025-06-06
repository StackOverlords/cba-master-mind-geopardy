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
    questionsLocalAnswered?: mongoose.Types.ObjectId[]; // IDs de las preguntas respondidas localmente

    categorys: mongoose.Types.ObjectId[]; // IDs de las categorías usadas en la partida
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    defaultTurnTime?: number; // Tiempo por defecto para cada turno

    code: string; // Código del juego único
    currentRound: number; // El número de la ronda actual
    currentPlayerDbId: mongoose.Types.ObjectId | null | string; // ID del jugador en turno (para persistencia)
    finalResults?: { // Define finalResults as an object
        positions: {
            playerId: mongoose.Types.ObjectId;
            position: number;
            score: number;
        }[];
    };

    playersLocal?: [{
        username: string;
        score: number;
        currentTurn?: boolean; // Indica si es el turno actual del jugador
    }];
    finalResultsLocal?:object[],
    // rondas
    rounds?: number; // Número de rondas en el juego
} 
const question = {
    type: mongoose.Types.ObjectId,
    ref: "Question"
}
const questionAnswered = {
    questionId: {
        type: mongoose.Types.ObjectId,
        ref: "Question"
    },
    // playerName: {
    //     type: String,
    //     required: true
    // },
    answer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
}

const category = {
    type: mongoose.Types.ObjectId,
    ref: "Category"
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
    questionsLocalAnswered: {
        type: [questionAnswered],
        default: [],
    },
    categorys: {
        type: [category],
        default: [],
    },
    code: {
        type: String,
        unique: true, // Asegura que el código del juego sea único
        required: false,
        trim: true,
    },
    finalResults: {
        type: { // Define que finalResults es un objeto
            positions: { // Y este objeto tiene una propiedad 'positions'
                type: [positions], // Que es un array de 'positions'
                default: []
            }
        },
        required: false,
        default: {} // Importante: el valor por defecto debe ser un objeto vacío si es un objeto anidado
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
    defaultTurnTime: {
        type: Number,
        default: 30, // Tiempo por defecto en segundos
    },

    playersLocal: [{
        username: { type: String, required: true },
        score: { type: Number, default: 0 },
        currentTurn:{
            type: Boolean,
            default: false, // Indica si es el turno actual del jugador
        }
    }],

    rounds: {
        type: Number,
        required: false,
        default: 1, // Número de rondas por defecto
        min: 1, // Al menos una ronda 
    },

    finalResultsLocal:{
        type:Array,
        default: [],
        _id: false, // No necesitamos un ID para este arreglo
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export const GameModel = mongoose.model<IGame>("Game", gameSchema);
