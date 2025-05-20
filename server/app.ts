import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { DBConnectorMongoose } from './src/config/database';
import router from './src/api/routes/index.route';
import { errorHandler } from './src/api/middlewares/error.middleware';
import http from 'http';
import { SocketConnection } from './src/config/websockets';

const app = express();

const PORT = process.env.PORT || 3000;
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf-8'));
const server = http.createServer(app);

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1', router) // router

app.get('/api/v1', (_, res) => {
    res.send('Welcome to the API CBA-MASTER-MIND-GEOPARDY 🌿');
})

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);


const initSockets = async () => {
    try {
        const socketConnection = SocketConnection.getInstance();
        await socketConnection.connect(server);
        if (process.env.NODE_ENV === 'development') {
            console.log("✅ Socket.io configurado correctamente");
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("❌ Error al configurar Socket.io:", error);
        }
    }
}



DBConnectorMongoose.getInstance().connect()
    .then(() => {
        server.listen(PORT, async () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Server is running on http://localhost:${PORT}`);
                console.log(`Swagger UI is available at http://localhost:${PORT}/api/api-docs`);
            }
            await initSockets();
        })
    })
    .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
            console.error("Error starting the server", error);
        }
        process.exit(1);
    }) 