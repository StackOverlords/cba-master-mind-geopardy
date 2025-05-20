import { Server, Socket } from "socket.io";
import { CustomError } from "../api/middlewares/error.middleware";
import { IUser, UserModel } from "../core/models/User.model";
import { IGame, GameModel } from "../core/models/Game.model";
import { QuestionModel, IQuestion } from "../core/models/Question.Model"; // Importa tu modelo de preguntas

import http from "http";
import { generate } from 'short-uuid'; // Librería para generar IDs cortos y únicos

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
    // Añadir historial de preguntas si es necesario para el frontend
    // askedQuestions: IQuestion[];
}

const games: { [gameCode: string]: GameRoomState } = {};

const MAX_QUESTIONS_PER_GAME = 10; // Número de preguntas para una partida (ajusta según tus rondas)
const TURN_TIMER_SECONDS = 15; // Segundos para responder una pregunta

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
                try {
                    const user = await UserModel.findById(userData.userId);
                    if (!user) {
                        socket.emit("error", { message: "Usuario no encontrado" });
                        return;
                    }
                    const gameCode = generate().substring(0, 8).toUpperCase();

                    // Traer preguntas de la BD (ejemplo: aleatorias)
                    const availableQuestions = await QuestionModel.aggregate([
                        { $sample: { size: MAX_QUESTIONS_PER_GAME } } // Obtener preguntas aleatorias
                    ]);
                    if (availableQuestions.length < MAX_QUESTIONS_PER_GAME) {
                        socket.emit("error", { message: "No hay suficientes preguntas disponibles para iniciar la partida." });
                        return;
                    }

                    const newGame = await GameModel.create({
                        ...userData.gameData,
                        code: gameCode,
                        user: userData.userId,
                        players: [{ playerId: user._id, username: user.name, score: 0 }], // Inicializar score
                        questions: availableQuestions.map((q: IQuestion) => q._id), // Guardar solo IDs de preguntas en la DB
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
                        questionsAvailable: availableQuestions as IQuestion[], // Usar el array de preguntas completas aquí
                        currentQuestion: null,
                        currentPlayerIndex: 0, // El primer jugador es el owner inicialmente
                        currentRound: 0,
                        turnTimer: null,
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
                    socket.emit("gameState", { players: gameRoom.players, gameData: gameRoom.gameData, currentQuestion: gameRoom.currentQuestion });
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
                    socket.emit("gameState", { players: gameRoom.players, gameData: gameRoom.gameData, currentQuestion: gameRoom.currentQuestion });
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

            socket.on("startGame", async (gameCode: string) => {
                const gameRoom = games[gameCode];
                if (!gameRoom) {
                    socket.emit("error", { message: "Partida no encontrada" });
                    return;
                }

                if (gameRoom.ownerId !== socket.handshake.auth.userId) {
                    socket.emit("error", { message: "Solo el creador puede iniciar la partida" });
                    return;
                }
                if (gameRoom.players.length < 2) { // Ejemplo: Requiere al menos 2 jugadores
                    socket.emit("error", { message: "Se necesitan al menos 2 jugadores para iniciar la partida." });
                    return;
                }

                gameRoom.gameData.status = "playing";
                gameRoom.currentRound = 1; // Iniciar la ronda 1
                gameRoom.currentPlayerIndex = Math.floor(Math.random() * gameRoom.players.length); // Elegir un jugador inicial aleatorio

                // Guardar el estado inicial en DB
                await GameModel.findOneAndUpdate(
                    { code: gameCode },
                    {
                        status: "playing",
                        currentRound: gameRoom.currentRound,
                        currentPlayerDbId: gameRoom.players[gameRoom.currentPlayerIndex].userId // Guardar el ID de la DB
                    }
                );

                this.io?.to(gameCode).emit("gameStarted");
                console.log(`🚀 Partida ${gameCode} iniciada.`);
                this.sendNextQuestion(gameCode); // Enviar la primera pregunta
            });

            // Responder a una pregunta
            socket.on("answerQuestion", async (data: { gameCode: string; answerText: string }) => {
                const { gameCode, answerText } = data;
                const gameRoom = games[gameCode];

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
                    newScore: currentPlayer.score
                });

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
                $push: { questions: questionToSend._id }, // Añadir el ID de la pregunta al historial de la partida
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
            timer: TURN_TIMER_SECONDS
        });
        console.log(`❓ Pregunta enviada para ${currentPlayer.username} en la partida ${gameCode}`);

        // Iniciar el temporizador del turno
        this.startTurnTimer(gameCode);
    }

    private startTurnTimer(gameCode: string): void {
        const gameRoom = games[gameCode];
        if (!gameRoom) return;

        // Limpiar cualquier temporizador anterior
        if (gameRoom.turnTimer) {
            clearTimeout(gameRoom.turnTimer);
        }

        let timeLeft = TURN_TIMER_SECONDS;
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
            this.io?.to(currentPlayerSocketId).emit("updateTimer", timeLeft); // Solo al jugador en turno
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

        // Verificar si se alcanzó el límite de rondas o preguntas
        if (gameRoom.currentRound > (MAX_QUESTIONS_PER_GAME / gameRoom.players.length)) { // Ajusta esta lógica según tus reglas de juego
            // Por ejemplo, si cada jugador responde una pregunta por ronda, entonces MAX_QUESTIONS_PER_GAME / N_PLAYERS_PER_ROUND
            this.endGame(gameCode);
            return;
        }

        // Dar un pequeño respiro antes de la siguiente pregunta/turno
        setTimeout(() => {
            this.sendNextQuestion(gameCode);
        }, 3000); // Pausa de 3 segundos
    }

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
        gameRoom.gameData.finalResults = {
            positions: sortedPlayers.map((player, index) => ({
                playerId: player.userId,
                position: index + 1,
                score: player.score
            }))
        };

        // Actualizar el estado de la partida en la base de datos a "finished" y guardar resultados
        await GameModel.findOneAndUpdate(
            { code: gameCode },
            {
                status: "finished",
                finalResults: gameRoom.gameData.finalResults,
                $set: { "players.$[elem].score": gameRoom.players.map(p => p.score) } // Actualiza todos los scores en la DB
            },
            { arrayFilters: [{ "elem.playerId": { $exists: true } }] } // Para actualizar todos los elementos del array de jugadores
        );


        this.io?.to(gameCode).emit("gameOver", {
            ranking: gameRoom.gameData.finalResults.positions,
            playersScores: gameRoom.players.map(p => ({ userId: p.userId, username: p.username, score: p.score }))
        });

        console.log(`🏆 Partida ${gameCode} finalizada. Resultados:`, gameRoom.gameData.finalResults.positions);

        // Puedes decidir eliminar la sala de la memoria después de un tiempo o al final del juego
        // delete games[gameCode];
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