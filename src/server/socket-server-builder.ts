import { ISubscriber } from "src/types/api/ISubscriber";
import { Express } from 'express';
import { SocketServer } from "./socket-server";

/**
 * Builds a SocketServer class using the builder pattern
 */
export class SocketServerBuilder {
    private readonly _app: Express;
    private _port: number = 51282;
    private _subscribers: ISubscriber[] = [];

    constructor(app: Express) {
        this._app = app;
    }

    setPort(port: number) {
        this._port = port;
        return this;
    }

    setSubscribers(subscribers: ISubscriber[]) {
        this._subscribers = subscribers;
        return this;
    }

    build() {
        return new SocketServer(this);
    }

    get app() {
        return this._app;
    }

    get port() {
        return this._port;
    }

    get subscribers() {
        return this._subscribers;
    }
}