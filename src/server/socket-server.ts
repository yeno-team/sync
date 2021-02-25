import { ISubscriber } from "src/types/subscribers/ISubscriber";
import { SocketServerBuilder } from "./socket-server-builder";
import { Express } from 'express';
import http from 'http';
import * as io from 'socket.io';

/**
 * SocketServer class built with SocketServerBuilder class
 */
export class SocketServer {
    private _app: Express;
    private _port: number;
    private _subscribers: ISubscriber[];

    /**
     * Transfers all the properties from the builder class to this class
     * @param socketServerBuilder builder class
     */
    constructor(socketServerBuilder: SocketServerBuilder) {
        this._app = socketServerBuilder.app;
        this._port = socketServerBuilder.port;
        this._subscribers = socketServerBuilder.subscribers;
    }

    /**
     * Creates a new http server for socket.io and starts it
     * Injects the socket server into every subscriber
     */
    public start() {
        const socketHttpServer = http.createServer(this._app);
        const socketServer = new io.Server(socketHttpServer);

        socketHttpServer.listen(this._port, () => console.log(`Socket Server started at port ${this._port}`));
        
        this._subscribers.forEach((subscriber) => {
            subscriber.injectSocketServer(socketServer);
        });
    }
}