import { io, Socket } from "socket.io-client";
import { apiVariables } from "../config/env";


let socket: Socket | null = null;

const SOCKET_URL = apiVariables.socketUri || "http://localhost:3000"; // O desde una variable de entorno

interface SocketServiceInterface {
    connect: (userId: string) => void;
    disconnect: () => void;
    emit: <T>(event: string, data: T) => void;
    on: <T>(event: string, callback: (data: T) => void) => void;
    off: (event: string, callback?: (...args: any[]) => void) => void;
    isActive: () => boolean; // Verifica si el socket está conectado
    getSocket: () => Socket | null; // Opcional, si necesitas acceso directo en algunos casos
}

export const socketService: SocketServiceInterface = {
    connect: (userId) => {
        console.log(userId," userId");
        if (socket && socket.connected) {
            console.log("Socket ya está conectado.");
            return;
        }

        console.log("🔌 Intentando conectar al servidor WebSocket...");
        socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            auth: {
                userId: userId,
            }, 
            query: { // Agregar también como query parameter por si acaso
                userId: userId
            }
        });

        socket.on("connect", () => {
            console.log("✅ Conectado al servidor WebSocket con ID:", socket?.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Desconectado del servidor WebSocket:", reason);
            // Podrías intentar reconectar aquí si la razón es inesperada,
            // o limpiar el objeto socket si la desconexión es intencional.
            // if (reason === "io server disconnect") {
            //   socket?.connect(); // Intento de reconexión manual
            // }
        });

        socket.on("connect_error", (error) => {
            console.error("❌ Error de conexión WebSocket:", error.message, error);
        });


        socket.on("error", (error) => {
            console.error("❌ Error en el socket:", error.message, error);
        });
        // Aquí podrías registrar listeners globales si los necesitas
        // socket.on("globalNotification", (data) => { /* ... */ });
    },
    disconnect: () => {
        if (socket) {
            console.log("🔌 Desconectando del servidor WebSocket...");
            socket.disconnect();
            socket = null; // Limpia la instancia
        }
    },

    emit: (event, data) => {
        if (socket && socket.connected) {
            socket.emit(event, data);
        } else {
            console.error(`No se puede emitir el evento "${event}". Socket no conectado.`);
            // Podrías encolar eventos o manejar este error de otra forma
        }
    },

    on: (event, callback) => {
        if (socket) {
            socket.on(event, callback);
        } else {
            console.warn(`Socket no inicializado para escuchar el evento "${event}".`);
        }
    },

    off: (event, callback) => { 
        if (socket && callback) {
            socket.off(event, callback as (...args: any[]) => void);
        }
    },

    isActive: () => !!socket && socket.connected,

    getSocket: () => socket,
};

// Opcional: Exportar una función para obtener el estado de conexión
export const isSocketConnected = (): boolean => !!(socket && socket.connected);