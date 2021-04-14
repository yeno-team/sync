import config from './config'
import { ServerBuilder } from './server/server-builder';
import express from 'express';
import { controllers, subscribers } from './server/api';
import { SocketServerBuilder } from './server/socket-server-builder';
const app = express();

const PORT = config.server.PORT;

const server = new ServerBuilder(app)
    .setEnv(process.env.NODE_ENV)
    .setPort(PORT)
    .setControllers(controllers)
    .build();

const socketServer = new SocketServerBuilder(app)
    .setPort(PORT)
    .setSubscribers(subscribers)
    .build();

server.start();
socketServer.start();