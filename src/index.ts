import config from './config'
import { ServerBuilder } from './server/server-builder';
import express from 'express';
import { controllers, subscribers } from './server/api';
import { SocketServerBuilder } from './server/socket-server-builder';
import rateLimit from "express-rate-limit";
const app = express();

const PORT = config.server.PORT;

/**
 * Global API limiter
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000
});

const server = new ServerBuilder(app)
    .setEnv(process.env.NODE_ENV)
    .setPort(PORT)
    .setControllers(controllers)
    .setApiLimiter(apiLimiter)
    .build();

const socketServer = new SocketServerBuilder(app)
    .setPort(PORT)
    .setSubscribers(subscribers)
    .build();

server.start();
socketServer.start();