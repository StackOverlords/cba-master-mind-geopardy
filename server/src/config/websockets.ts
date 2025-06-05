import { Server, Socket } from "socket.io";
import { CustomError } from "../api/middlewares/error.middleware";
import { IUser, UserModel } from "../core/models/User.model";
import { IGame, GameModel } from "../core/models/Game.model";
import { QuestionModel, IQuestion } from "../core/models/Question.Model"; // Importa tu modelo de preguntas

import http from "http";
import { generate } from 'short-uuid'; // Librería para generar IDs cortos y únicos
import mongoose from "mongoose";

interface PlayerInGame {
    socketId: string;
    userId: string;
    username: string;
    score: number; // Añadimos el puntaje del jugador en tiempo real
    hasAnsweredThisTurn: boolean; // Para controlar si el jugador ya respondió en su turno
}

interface GameRoomState {
    code: string;
    ownerId: string; // ID del usuario creador
    // Cambiar a Partial para poder actualizar solo lo necesario en players
    players: PlayerInGame[]; // Arreglo de jugadores en la partida
    gameData: IGame; // Datos del juego desde la BD
    questionsAvailable: IQuestion[]; // Las preguntas que quedan por usar en esta partida
    currentQuestion: IQuestion | null; // La pregunta actual que se está mostrando
    currentPlayerIndex: number; // Índice del jugador cuyo turno es
    currentRound: number; // Ronda actual del juego
    // Puedes añadir un temporizador para el turno si lo manejas directamente aquí
    turnTimer: NodeJS.Timeout | null; // Para el contador de tiempo del turno
    turnOutTimer: NodeJS.Timeout | null; // Para el temporizador de turno
    // Añadir historial de preguntas si es necesario para el frontend
    // askedQuestions: IQuestion[];
    defaultTurnTime: number;

}

const games: { [gameCode: string]: GameRoomState } = {};

const DEFAULT_ROUNDS = 5; // Define un número de rondas por defecto "PENDIENTE DE DEFINIR AL EMPIEZO DE LA PARTIDA"
const EXTRA_QUESTIONS_BUFFER = 2; // Preguntas adicionales para mayor flexibilidad "PENDIENTE DE DEFINIR AL EMPIEZO DE LA PARTIDA"

const TURN_TIMER_SECONDS = 60; // Segundos para responder una pregunta "PENDIENTE DE DEFINIR AL EMPIEZO DE LA PARTIDA"

export class SocketConnection {
    private static instance: SocketConnection;
    private io: Server | null = null;

    private constructor() { }

    public static getInstance(): SocketConnection {
        if (!SocketConnection.instance) {
            SocketConnection.instance = new SocketConnection();
        }
        return SocketConnection.instance;
    }

    public getIO(): Server {
        if (!this.io) {
            throw new CustomError("Socket.io no ha sido inicializado. Llama a connect() primero.", 500);
        }
        return this.io;
    }

    public async connect(server: http.Server): Promise<void> {
        try {
            this.io = new Server(server, {
                cors: {
                    origin: process.env.CORS_ORIGIN || "*",
                    methods: ["GET", "POST"]
                },
                transports: ["websocket", "polling"],
            });

            this.setupSocketEvents();
            if (process.env.NODE_ENV === 'development') {
                console.log("✅ Socket.io inicializado correctamente");
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error("❌ Error al inicializar Socket.io:", error);
            }
            throw new CustomError("Error connecting to WebSocket server", 500);
        }
    }

    private setupSocketEvents(): void {
        console.log("📡 Configurando eventos de Socket.io...");
        if (!this.io) return;

        this.io.on("connection", (socket: Socket) => {
            console.log(`👤 Cliente conectado: ${socket.id}`);
             const userId = socket.handshake.auth?.userId;
             console.log(`👤 Usuario conectado: ${userId} con socket ID: ${socket.id}`);
            socket.on("disconnect", () => {
                console.log(`👤 Cliente desconectado: ${socket.id}`);
                this.handleDisconnect(socket);
            });

            socket.on("error", (error) => {
                console.error(`❌ Error en el socket ${socket.id}:`, error);
            });

            // ***** Eventos del juego *****
            // Crear una nueva partida
            socket.on("createGame", async (userData: { userId: string; gameData: Omit<IGame, '_id' | 'code' | 'players' | 'questions'> }) => {
                console.log(socket.handshake.auth.userId, "intenta crear una partida");
                try {
                    const user = await UserModel.findById(userData.userId);
                    if (!user) {
                        socket.emit("error", { message: "Usuario no encontrado" });
                        return;
                    }
                    const gameCode = generate().substring(0, 8).toUpperCase(); 
                    
                    if(!userData.gameData.categorys || userData.gameData.categorys.length === 0) {
                        socket.emit("error", { message: "No hay categorías seleccionadas." });
                        return;
                    }
                    const newGame = await GameModel.create({
                        ...userData.gameData,
                        code: gameCode,
                        user: userData.userId,
                        players: [{ playerId: user._id, username: user.name, score: 0 }], // Inicializar score
                        questions: [], // No hay preguntas al crear, se cargarán al iniciar
                        categorys: userData.gameData.categorys,
                        defaultTurnTime: userData.gameData.defaultTurnTime || TURN_TIMER_SECONDS,
                        currentRound: 0, // Se iniciará en 1 al empezar
                        currentPlayerDbId: null,
                    });

                    if (!newGame) {
                        socket.emit("error", { message: "Error al crear el juego" });
                        return;
                    }

                    const newRoom: GameRoomState = {
                        code: gameCode,
                        ownerId: userData.userId,
                        players: [{ socketId: socket.id, userId: userData.userId, username: user.name, score: 0, hasAnsweredThisTurn: false }],
                        gameData: newGame,
                        questionsAvailable: [], // Vacío inicialmente
                        currentQuestion: null,
                        currentPlayerIndex: 0, // El primer jugador es el owner inicialmente
                        currentRound: 0,
                        turnTimer: null,
                        turnOutTimer:null,
                        defaultTurnTime: userData.gameData.defaultTurnTime || TURN_TIMER_SECONDS,
                    };
                    games[gameCode] = newRoom;

                    socket.join(gameCode);
                    socket.emit("gameCreated", { gameCode });
                    this.io?.to(gameCode).emit("playerJoined", { userId: userData.userId, username: user.name, score: 0 });
                    console.log(`🎮 Juego creado con código: ${gameCode} por el usuario ${user.name} (${userData.userId})`);
                } catch (error) {
                    console.error("❌ Error al crear el juego:", error);
                    socket.emit("error", { message: "Error al crear el juego" });
                }
            });

            socket.on("joinGame", async (joinData: { gameCode: string; userData: { userId: string } }) => {
                const { gameCode, userData } = joinData;
                const gameRoom = games[gameCode];

                if (!gameRoom) {
                    socket.emit("error", { message: "Partida no encontrada" });
                    return;
                }
                const user = await UserModel.findById(userData.userId);
                if (!user) {
                    socket.emit("error", { message: "Usuario no encontrado" });
                    return;
                }

                const alreadyJoined = gameRoom.players.some(player => player.userId === userData.userId);
                if (alreadyJoined) {
                    // Actualizar socketId si es una reconexión
                    const player = gameRoom.players.find(p => p.userId === userData.userId);
                    if (player) {
                        player.socketId = socket.id;
                    }
                    socket.join(gameCode);
                    socket.emit("gameJoined", { gameCode });
                    this.io?.to(gameCode).emit("playerReconnected", { userId: userData.userId, username: user.name });
                    console.log(`👤 Usuario ${user.name} (${userData.userId}) reconectado a la partida: ${gameCode}`);
                    // Asegurarse de enviar el estado actual de la partida al reconectado
                    console.log(gameRoom, "estado de la partida al reconectar");
                    socket.emit("gameState", { ownerId: gameRoom, players: gameRoom.players, gameData: gameRoom.gameData, currentQuestion: gameRoom.currentQuestion });
                    return;
                }

                // Verificar si la partida ya inició
                if (gameRoom.gameData.status !== "waiting") {
                    socket.emit("error", { message: "La partida ya ha comenzado. No puedes unirte ahora." });
                    return;
                }

                gameRoom.players.push({ socketId: socket.id, userId: userData.userId, username: user.name, score: 0, hasAnsweredThisTurn: false });
                // NOTA: gameRoom.gameData.players.push() no es estrictamente necesario aquí si actualizas la DB después
                socket.join(gameCode);
                socket.emit("gameJoined", { gameCode });
                this.io?.to(gameCode).emit("playerJoined", { userId: userData.userId, username: user.name, score: 0 });
                console.log(`👤 Usuario ${user.name} (${userData.userId}) se unió a la partida: ${gameCode}`);

                this.io?.to(socket.id).emit("gamePlayers", { players: gameRoom.players });
                socket.broadcast.to(gameCode).emit("gamePlayers", { players: gameRoom.players });

                // Actualizar la partida en la base de datos (añadir el nuevo jugador con score 0)
                await GameModel.findOneAndUpdate(
                    { code: gameCode },
                    { $push: { players: { playerId: userData.userId, username: user.name, score: 0 } } }
                );
            });


            socket.on("getGameState", (gameCode: string) => {
                const gameRoom = games[gameCode];
                if (gameRoom) {
                    socket.emit("gameState", { players: gameRoom.players, gameData: gameRoom.gameData, currentQuestion: gameRoom.currentQuestion, defaultTurnTime: gameRoom.defaultTurnTime });
                } else {
                    socket.emit("error", { message: "Partida no encontrada" });
                }
            });
            socket.on("getRooms", () => {
                console.log(socket.id, "solicita la lista de partidas");
                socket.emit("roomsList", games);
                console.log("🗂️ Lista de partidas enviadas:", JSON.stringify(games));
            }
            );

            // En SocketConnection class, dentro de setupSocketEvents()
            socket.on("startGame", async (gameData:{gameCode:string,userId:string}) => {
                const { gameCode, userId } = gameData;
                if(!gameCode || !userId) {
                    console.log("Datos de partida incompletos:", gameData);
                    socket.emit("error", { message: "Datos de partida incompletos" });
                    return;
                }
                console.log("Iniciando partida con código:", gameCode);
                const gameRoom = games[gameCode];
                if (!gameRoom) {
                    console.log("Partida no encontrada")
                    socket.emit("error", { message: "Partida no encontrada" });
                    return;
                }
                console.log(userId, "intenta iniciar la partida");
                if (gameRoom.ownerId !== userId) {
                    console.log("Solo el creador puede iniciar la partida");
                    socket.emit("error", { message: "Solo el creador puede iniciar la partida" });
                    return;
                }
                if (gameRoom.players.length < 2) {
                    console.log("Se necesitan al menos 2 jugadores para iniciar la partida");
                    socket.emit("error", { message: "Se necesitan al menos 2 jugadores para iniciar la partida." });
                    return;
                }

                // Obtener las categorías seleccionadas para esta partida
                const selectedCategories = gameRoom.gameData.categorys;
                if (!selectedCategories || selectedCategories.length === 0) {
                    console.log("No se seleccionaron categorías para esta partida");
                    socket.emit("error", { message: "No se seleccionaron categorías para esta partida." });
                    return;
                }

                // Calcular la cantidad total de preguntas necesarias
                const numberOfPlayers = gameRoom.players.length;
                console.log(numberOfPlayers, "jugadores");
                const totalQuestionsNeeded = (numberOfPlayers * DEFAULT_ROUNDS) + EXTRA_QUESTIONS_BUFFER;
                console.log(totalQuestionsNeeded, "preguntas necesarias");

                let allAvailableQuestions: IQuestion[] = [];
                const questionsPerCategoryBase = Math.floor(totalQuestionsNeeded / selectedCategories.length);
                let remainderQuestions = totalQuestionsNeeded % selectedCategories.length;

                // Paso 1: Intentar obtener una cantidad equitativa de cada categoría
                for (const category of selectedCategories) {
                    console.log(category, "categoría");
                    // Calcular cuántas preguntas intentar obtener para esta categoría
                    const countToFetch = questionsPerCategoryBase + (remainderQuestions > 0 ? 1 : 0);
                    if (remainderQuestions > 0) remainderQuestions--;

                    const questionsFromCategory = await QuestionModel.aggregate([
                        { $match: { categoryId: category } },
                        { $sample: { size: countToFetch } }
                    ]);
                    allAvailableQuestions = allAvailableQuestions.concat(questionsFromCategory as IQuestion[]);
                }

                // Paso 2: Si aún no tenemos suficientes, intenta llenar el vacío con más preguntas de cualquier categoría.
                // Esto es crucial si algunas categorías no tenían suficientes preguntas en el Paso 1.
                if (allAvailableQuestions.length < totalQuestionsNeeded) {
                    const questionsToFetchMore = totalQuestionsNeeded - allAvailableQuestions.length;
                    
                    // Obtener preguntas adicionales de forma aleatoria de todas las categorías seleccionadas
                    // Excluye las preguntas que ya tienes para evitar duplicados.
                    const existingQuestionIds = allAvailableQuestions.map(q => q._id);
                    
                    const additionalQuestions = await QuestionModel.aggregate([
                        { $match: { categoryId: { $in: selectedCategories }, _id: { $nin: existingQuestionIds } } },
                        { $sample: { size: questionsToFetchMore } }
                    ]);
                    allAvailableQuestions = allAvailableQuestions.concat(additionalQuestions as IQuestion[]);
                }

                // Mezclar todas las preguntas obtenidas
                allAvailableQuestions = allAvailableQuestions.sort(() => 0.5 - Math.random());
                console.log(allAvailableQuestions.length, "preguntas disponibles después de compensación");

                // Verificar si tenemos suficientes preguntas en total después de la compensación
                if (allAvailableQuestions.length < totalQuestionsNeeded) {
                    console.log("No hay suficientes preguntas disponibles en las categorías seleccionadas para iniciar la partida con esta configuración.");
                    socket.emit("error", { message: "No hay suficientes preguntas disponibles en las categorías seleccionadas para iniciar la partida con esta configuración. Intenta con más categorías o menos rondas." });
                    return;
                }

                // Recortar si tenemos más preguntas de las necesarias
                gameRoom.questionsAvailable = allAvailableQuestions.slice(0, totalQuestionsNeeded);
                
                gameRoom.gameData.status = "playing";
                gameRoom.currentRound = 1;
                gameRoom.currentPlayerIndex = Math.floor(Math.random() * gameRoom.players.length);

                // Guardar el estado inicial en DB
                await GameModel.findOneAndUpdate(
                    { code: gameCode },
                    {
                        status: "playing",
                        currentRound: gameRoom.currentRound,
                        currentPlayerDbId: gameRoom.players[gameRoom.currentPlayerIndex].userId,
                        questions: gameRoom.questionsAvailable.map((q: IQuestion) => q._id),
                    }
                );

                this.io?.to(gameCode).emit("gameStarted", {
                    gameCode: gameCode,
                    players: gameRoom.players
                });
                console.log("Enviando broadcast de inicio de partida a la sala:", gameCode);
                console.log(`🚀 Partida ${gameCode} iniciada con categorías: ${selectedCategories.join(', ')}.`);
                this.sendNextQuestion(gameCode);
            });

            // Responder a una pregunta
            socket.on("answerQuestion", async (data: { gameCode: string; answerText: string }) => {
                console.log(data, "respuesta a la pregunta");
                const { gameCode, answerText } = data;
                const gameRoom = games[gameCode];
                console.log(gameRoom, "estado de la partida al responder");
                if (!gameRoom || !gameRoom.currentQuestion) {
                    socket.emit("error", { message: "No hay una pregunta activa o la partida no existe." });
                    return;
                }

                const currentPlayer = gameRoom.players[gameRoom.currentPlayerIndex];

                // Verificar si es el turno del jugador y si no ha respondido ya
                if (currentPlayer.socketId !== socket.id || currentPlayer.hasAnsweredThisTurn) {
                    socket.emit("error", { message: "No es tu turno o ya respondiste." });
                    return;
                }

                // Detener el temporizador de turno si está activo
                if (gameRoom.turnTimer) {
                    clearTimeout(gameRoom.turnTimer);
                    gameRoom.turnTimer = null;
                }

                currentPlayer.hasAnsweredThisTurn = true; // Marcar que el jugador ya respondió

                const correctAnswer = gameRoom.currentQuestion.answers.find((a: any) => a.isCorrect)?.text;
                const isCorrect = (answerText === correctAnswer);

                let pointsAwarded = 0;
                if (isCorrect) {
                    // Asume que la pregunta tiene una propiedad 'points' o calcula en base a la categoría/dificultad
                    pointsAwarded = 100; // Ejemplo de puntos
                    currentPlayer.score += pointsAwarded;
                }

                // Emitir el resultado de la respuesta a todos en la sala
                this.io?.to(gameCode).emit("answerResult", {
                    playerId: currentPlayer.userId,
                    username: currentPlayer.username,
                    isCorrect,
                    correctAnswer: correctAnswer,
                    pointsAwarded,
                    newScore: currentPlayer.score,
                    players: gameRoom.players
                });
                this.io?.to(gameCode).emit("gamePlayers", { players: gameRoom.players.map(p => ({ userId: p.userId, username: p.username, score: p.score })) });

                // Actualizar puntuación del jugador en la base de datos
                await GameModel.findOneAndUpdate(
                    { code: gameCode, "players.playerId": currentPlayer.userId },
                    { $set: { "players.$.score": currentPlayer.score } }
                );

                // Avanzar al siguiente turno o ronda
                this.moveToNextTurn(gameCode);
            });

            // Otros eventos del juego (manejo de turnos, respuestas, etc.) irán aquí


        });
    }
    private async sendNextQuestion(gameCode: string): Promise<void> {
        const gameRoom = games[gameCode];
        if (!gameRoom || gameRoom.gameData.status !== "playing") return;

        // Resetear el estado de respuesta para todos los jugadores para el nuevo turno
        gameRoom.players.forEach(p => p.hasAnsweredThisTurn = false);

        // Si no quedan preguntas disponibles, la partida termina (o se cargan más si es un juego muy largo)
        if (gameRoom.questionsAvailable.length === 0) {
            console.log(`🏁 No quedan más preguntas para la partida ${gameCode}.`);
            this.endGame(gameCode);
            return;
        }

        // Seleccionar una pregunta aleatoria de las disponibles
        const randomIndex = Math.floor(Math.random() * gameRoom.questionsAvailable.length);
        const questionToSend = gameRoom.questionsAvailable[randomIndex];

        // Remover la pregunta del pool para que no se repita
        gameRoom.questionsAvailable.splice(randomIndex, 1);
        gameRoom.currentQuestion = questionToSend; // Guardar la pregunta actual en el estado de la sala

        const currentPlayer = gameRoom.players[gameRoom.currentPlayerIndex];
        gameRoom.gameData.currentPlayerDbId = currentPlayer.userId; // Actualizar el jugador en turno en la DB

        // Actualizar la DB con la pregunta y el jugador en turno
        await GameModel.findOneAndUpdate(
            { code: gameCode },
            {
                // $push: { questions: questionToSend._id }, // This is already done at game start, no need to push here unless you want to store all questions asked in order.
                currentPlayerDbId: currentPlayer.userId
            }
        );

        // Emitir la pregunta al jugador en turno y al resto de la sala (solo para que vean quién tiene el turno)
        // No envíes la respuesta correcta al frontend aquí.
        const questionForClient = {
            _id: questionToSend._id,
            question: questionToSend.question,
            answers: questionToSend.answers.map((ans: any) => ({ text: ans.text })) // Enviar solo el texto de las respuestas
        };

        this.io?.to(gameCode).emit("newTurn", {
            currentPlayerId: currentPlayer.userId,
            currentPlayerUsername: currentPlayer.username,
            question: questionForClient,
            timer: gameRoom.defaultTurnTime 
        });
        console.log(`❓ Pregunta enviada para ${currentPlayer.username} en la partida ${gameCode}`);

        // Iniciar el temporizador del turno
        this.startTurnTimer(gameCode);
    }

    private startTurnTimer(gameCode: string): void { /// ERRORCORREGIR
        const gameRoom = games[gameCode];
        if (!gameRoom) return;

        // Limpiar cualquier temporizador anterior
        if (gameRoom.turnTimer) {
            clearTimeout(gameRoom.turnTimer);
        }

        let timeLeft = gameRoom.defaultTurnTime; // Tiempo por defecto para el turno
        const currentPlayerSocketId = gameRoom.players[gameRoom.currentPlayerIndex].socketId;

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameRoom.turnTimer = null;
                console.log(`⌛ Tiempo agotado para ${gameRoom.players[gameRoom.currentPlayerIndex].username} en ${gameCode}`);
                // Si el tiempo se agota y el jugador no respondió, considera su respuesta como incorrecta
                const currentPlayer = gameRoom.players[gameRoom.currentPlayerIndex];
                if (!currentPlayer.hasAnsweredThisTurn) {
                    this.io?.to(gameCode).emit("answerResult", {
                        playerId: currentPlayer.userId,
                        username: currentPlayer.username,
                        isCorrect: false,
                        message: "¡Tiempo agotado!",
                        newScore: currentPlayer.score
                    });
                }
                this.moveToNextTurn(gameCode);
                return;
            }
            this.io?.to(gameCode).emit("updateTimer", timeLeft); // A todos los jugadores en la sala
            timeLeft--;
        }, 1000);

        gameRoom.turnTimer = timerInterval; // Guardar el ID del intervalo para poder limpiarlo
    }

    private async moveToNextTurn(gameCode: string): Promise<void> {
        const gameRoom = games[gameCode];
        if (!gameRoom) return;

        // Avanzar al siguiente jugador
        gameRoom.currentPlayerIndex++;
        if (gameRoom.currentPlayerIndex >= gameRoom.players.length) {
            // Todos los jugadores han tenido su turno en esta ronda
            gameRoom.currentPlayerIndex = 0; // Reiniciar para el siguiente jugador en la próxima ronda
            gameRoom.currentRound++; // Avanzar a la siguiente ronda
            console.log(`🎉 Fin de la ronda ${gameRoom.currentRound - 1} en la partida ${gameCode}. Iniciando ronda ${gameRoom.currentRound}.`);
            this.io?.to(gameCode).emit("roundFinished", { currentRound: gameRoom.currentRound - 1 });

            // Actualizar la ronda en la base de datos
            await GameModel.findOneAndUpdate({ code: gameCode }, { currentRound: gameRoom.currentRound });
        }

        // --- Criterios de finalización del juego ---
        // 1. Si se ha superado el número de rondas definidas.
        if (gameRoom.currentRound > DEFAULT_ROUNDS) {
            console.log(`🎉 La partida ${gameCode} ha alcanzado el límite de ${DEFAULT_ROUNDS} rondas.`);
            this.endGame(gameCode);
            return;
        }

        // 2. Si no quedan preguntas disponibles en el pool (a pesar de las rondas).
        if (gameRoom.questionsAvailable.length === 0) {
            console.log(`🏁 No quedan más preguntas disponibles para la partida ${gameCode}. Finalizando.`);
            this.endGame(gameCode);
            return;
        }
        // --- Fin de criterios de finalización ---

        // Dar un pequeño respiro antes de la siguiente pregunta/turno 
        let timeLeft = 3;
        const timeOut = setInterval(()=> {
            if(timeLeft <= 0) {
                clearInterval(timeOut);
                gameRoom.turnOutTimer = null;
                this.sendNextQuestion(gameCode);

            }
            this.io?.to(gameCode).emit("updateTimerOut", timeLeft);
            timeLeft--;
        }, 1000); 
    }

    // Inside endGame(gameCode: string) function
    private async endGame(gameCode: string): Promise<void> {
        const gameRoom = games[gameCode];
        if (!gameRoom) return;

        // Limpiar cualquier temporizador pendiente
        if (gameRoom.turnTimer) {
            clearTimeout(gameRoom.turnTimer);
            gameRoom.turnTimer = null;
        }

        gameRoom.gameData.status = "finished";

        // Calcular la clasificación final
        const sortedPlayers = [...gameRoom.players].sort((a, b) => b.score - a.score);
        
        // Store the full finalResults object structure directly
        gameRoom.gameData.finalResults = {
            positions: sortedPlayers.map((player, index) => ({
                playerId: new mongoose.Types.ObjectId(player.userId), // Convertir a ObjectId
                position: index + 1,
                score: player.score
            }))
        };

        // Actualizar el estado de la partida en la base de datos a "finished" y guardar resultados
        await GameModel.findOneAndUpdate(
            { code: gameCode },
            {
                status: "finished",
                // Directly assign the structured finalResults object
                finalResults: gameRoom.gameData.finalResults, 
                // Update scores for all players in the DB
                players: gameRoom.players.map(p => ({ playerId: p.userId, username: p.username, score: p.score }))
            },
            // No need for arrayFilters here if you're replacing the whole players array.
            // If you were only updating a specific field within existing array elements,
            // then arrayFilters would be relevant.
        );


        this.io?.to(gameCode).emit("gameOver", {
            ranking: gameRoom.gameData.finalResults.positions, // This will now correctly reflect the data
            playersScores: gameRoom.players.map(p => ({ userId: p.userId, username: p.username, score: p.score }))
        });

        // The console log will now correctly show the positions array
        console.log(`🏆 Partida ${gameCode} finalizada. Resultados:`, gameRoom.gameData.finalResults.positions);

        // Puedes decidir eliminar la sala de la memoria después de un tiempo o al final del juego
        delete games[gameCode];
        console.log(`🗑️ Partida ${gameCode} eliminada de la memoria.`);

        // Opcional: desconectar a todos los sockets de la sala para asegurar la limpieza
        this.io?.sockets.in(gameCode).socketsLeave(gameCode);
        
        console.log(`🗑️ Partida ${gameCode} eliminada de la base de datos.`);
    }

    private async handleDisconnect(socket: Socket): Promise<void> {
        for (const gameCode in games) {
            const gameRoom = games[gameCode];
            const initialPlayerCount = gameRoom.players.length;
            const disconnectedPlayer = gameRoom.players.find(p => p.socketId === socket.id);

            gameRoom.players = gameRoom.players.filter(player => player.socketId !== socket.id);

            if (gameRoom.players.length < initialPlayerCount && disconnectedPlayer) {
                console.log(`👤 Jugador ${disconnectedPlayer.username} (${disconnectedPlayer.userId}) abandonó la partida ${gameCode}. Jugadores restantes: ${gameRoom.players.length}`);
                this.io?.to(gameCode).emit("playerLeft", { userId: disconnectedPlayer.userId, username: disconnectedPlayer.username });
                this.io?.to(gameCode).emit("gamePlayers", { players: gameRoom.players.map(p => ({ userId: p.userId, username: p.username, score: p.score })) });


                // Si el jugador desconectado tenía el turno, pasarlo al siguiente
                if (gameRoom.gameData.status === "playing" && gameRoom.currentPlayerIndex < initialPlayerCount && gameRoom.players[gameRoom.currentPlayerIndex]?.socketId === disconnectedPlayer.socketId) {
                    if (gameRoom.turnTimer) {
                        clearTimeout(gameRoom.turnTimer);
                        gameRoom.turnTimer = null;
                    }
                    this.moveToNextTurn(gameCode); // Avanzar el turno
                }


                // Si la partida se queda sin jugadores, o el propietario se desconecta, manejar la situación
                if (gameRoom.players.length === 0) {
                    delete games[gameCode];
                    console.log(`🗑️ Partida ${gameCode} eliminada por falta de jugadores.`);
                    await GameModel.findOneAndDelete({ code: gameCode }); // Eliminar de la DB también
                    this.io?.to(gameCode).emit("gameOverPlayersCero", { reason: "no-players" });
                } else if (disconnectedPlayer.userId === gameRoom.ownerId) {
                    // Si el propietario se desconecta, puedes:
                    // 1. Asignar un nuevo propietario (el siguiente en la lista)
                    // 2. Terminar la partida
                    // 3. Pausar la partida
                    console.log(`🚨 El propietario de la partida ${gameCode} se ha desconectado. Partida en pausa o terminada.`);
                    this.endGame(gameCode); // Ejemplo: Terminar la partida
                }

                // Actualizar la base de datos para reflejar la salida del jugador
                await GameModel.findOneAndUpdate(
                    { code: gameCode },
                    { $pull: { players: { playerId: disconnectedPlayer.userId } } }
                );
            }
        }
    }
}