import { Server, Socket } from "socket.io";
import { CustomError } from "../api/middlewares/error.middleware";
import { IUser, UserModel } from "../core/models/User.model";
import { IGame, GameModel } from "../core/models/Game.model";
import http from "http";
import { generate } from 'short-uuid'; // Librería para generar IDs cortos y únicos

interface PlayerInGame {
    socketId: string;
    userId: string;
    username: string;
    // Otros datos relevantes del jugador en la partida
}

interface GameRoomState {
    code: string;
    ownerId: string; // ID del usuario creador
    players: PlayerInGame[];
    gameData: IGame; // Datos del juego desde la BD
    // Otros estados específicos de la partida en tiempo real (turno actual, etc.)
}

const games: { [gameCode: string]: GameRoomState } = {};

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

            socket.on("createGame", async (userData: { userId: string; gameData: Omit<IGame, '_id' | 'code' | 'players'> }) => {
                try {
                    const user = await UserModel.findById(userData.userId);
                    if (!user) {
                        socket.emit("error", { message: "Usuario no encontrado" });
                        return;
                    }
                    const gameCode = generate().substring(0, 8).toUpperCase(); // Generar código corto y único
                    const newGame = await GameModel.create({
                        ...userData.gameData, code: gameCode, user: userData.userId, players: [
                            { playerId: user._id, username: user.name, socketId: socket.id }
                        ]
                    });
                    if (!newGame) {
                        socket.emit("error", { message: "Error al crear el juego" });
                        return;
                    }
                    const newRoom: GameRoomState = {
                        code: gameCode,
                        ownerId: userData.userId,
                        players: [{ socketId: socket.id, userId: userData.userId, username: user.name }],
                        gameData: newGame,
                    };
                    games[gameCode] = newRoom;

                    socket.join(gameCode);
                    socket.emit("gameCreated", { gameCode });
                    this.io?.to(gameCode).emit("playerJoined", { userId: userData.userId, username: user.name }); // Informar al creador (por si acaso hay reconexión rápida)
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
                };
                // Verificar si el jugador ya está en la partida
                const alreadyJoined = gameRoom.players.some(player => player.userId === userData.userId);
                if (alreadyJoined) {
                    socket.join(gameCode); // Re-unir si se reconecta
                    socket.emit("gameJoined", { gameCode });
                    this.io?.to(gameCode).emit("playerReconnected", { userId: userData.userId, username: user.name });
                    console.log(`👤 Usuario ${user.name} (${userData.userId}) reconectado a la partida: ${gameCode}`);
                    return;
                }

                // Verificar si la partida está llena (puedes definir un límite)
                // if (gameRoom.players.length >= MAX_PLAYERS) {
                //     socket.emit("error", { message: "La partida está llena" });
                //     return;
                // }

                gameRoom.players.push({ socketId: socket.id, userId: userData.userId, username: user.name });
                gameRoom.gameData.players.push({ socketId: socket.id, userId: userData.userId, username: user.name });
                console.log(gameRoom.players, " JUGADORES nuevos actualizados");
                socket.join(gameCode);
                socket.emit("gameJoined", { gameCode });
                this.io?.to(gameCode).emit("playerJoined", { userId: userData.userId, username: user.name });
                console.log(`👤 Usuario ${user.name} (${userData.userId}) se unió a la partida: ${gameCode}`);

                // Emitir la lista actualizada de jugadores al recién llegado
                this.io?.to(socket.id).emit("gamePlayers", { players: gameRoom.players });
                // Emitir al resto de los jugadores la lista actualizada
                socket.broadcast.to(gameCode).emit("gamePlayers", { players: gameRoom.players });

                // Actualizar la partida en la base de datos (opcional, depende de si quieres persistir los jugadores inmediatamente)
                await GameModel.findOneAndUpdate({ code: gameCode }, { $push: { players: { playerId: userData.userId, username: user.name } } });
            });

            socket.on("getGameState", (gameCode: string) => {
                const gameRoom = games[gameCode];
                if (gameRoom) {
                    socket.emit("gameState", { players: gameRoom.players, gameData: gameRoom.gameData });
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

                if (gameRoom.ownerId !== socket.handshake.auth.userId) { // Asumiendo que envías userId en la autenticación del socket
                    socket.emit("error", { message: "Solo el creador puede iniciar la partida" });
                    return;
                }

                // Aquí puedes agregar lógica para verificar si hay suficientes jugadores para iniciar

                // Actualizar el estado del juego en la base de datos
                await GameModel.findOneAndUpdate({ code: gameCode }, { status: "playing" });
                gameRoom.gameData.status = "playing"; // Actualizar también en memoria

                this.io?.to(gameCode).emit("gameStarted");
                console.log(`🚀 Partida ${gameCode} iniciada`);
            });

            // Otros eventos del juego (manejo de turnos, respuestas, etc.) irán aquí

        });
    }

    private async handleDisconnect(socket: Socket): Promise<void> {
        for (const gameCode in games) {
            const gameRoom = games[gameCode];
            const initialPlayerCount = gameRoom.players.length;
            gameRoom.players = gameRoom.players.filter(player => player.socketId !== socket.id);
            if (gameRoom.players.length < initialPlayerCount) {
                console.log(`👤 Jugador ${socket.id} abandonó la partida ${gameCode}. Jugadores restantes: ${gameRoom.players.length}`);
                this.io?.to(gameCode).emit("playerLeft", { socketId: socket.id });
                this.io?.to(gameCode).emit("gamePlayers", { players: gameRoom.players });

                // Opcional: Si la partida se queda sin jugadores, puedes eliminarla del estado en memoria
                if (gameRoom.players.length === 0) {
                    delete games[gameCode];
                    console.log(`🗑️ Partida ${gameCode} eliminada por falta de jugadores.`);
                }

                // Opcional: Actualizar la base de datos si es necesario reflejar la salida del jugador
                await GameModel.findOneAndUpdate({ code: gameCode }, { $pull: { players: { socketId: socket.id } } });
            }
        }
    }
}