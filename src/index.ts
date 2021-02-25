import config from './config'
import { ServerBuilder } from './server/server-builder';
import express from 'express';
import controllers from './server/api';
const app = express();

const PORT = config.server.PORT;

const server = new ServerBuilder(app)
    .setEnv(process.env.NODE_ENV)
    .setPort(PORT)
    .setControllers(controllers)
    .build();

server.start();