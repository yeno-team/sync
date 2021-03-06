import express, { Application, Express, Request, Response, Router } from 'express';
import cors from "cors";
import { ServerBuilder } from './server-builder';
import path from 'path';
import { IController } from 'src/types/api/IController';
import http from 'http';
import * as io from "socket.io";

/**
 * The main server class that is built with the ServerBuilder class.
 */
export class Server {
    private _app: Express;
    private _port: number;
    private _env: String;
    private _apiLimiter: Application;
    private _controllers: IController[];

    /**
     * The constructor uses the properties in ServerBuilder and sets them on the Server class
     * @param serverBuilder the builder class
     */
    constructor(serverBuilder: ServerBuilder) {
        this._app = serverBuilder.app;
        this._port = serverBuilder.port;
        this._env = serverBuilder.env;
        this._apiLimiter = serverBuilder.apiLimiter;
        this._controllers = serverBuilder.controllers;
    }

    /** 
     * Handles production deployment for frontend.
     * Routes the api controller routes.
     * Starts the express server.
    */
    public start() {
        const apiRouter = Router();
        
        this._app.use(cors());
        this._app.use(express.json());
        this._app.use(express.urlencoded({
            extended: true
        }));

        this._app.use("/api", this._apiLimiter, apiRouter)

        if (this._env == 'production') {
            this.serveClientProductionBuild();
            console.log("Served client build");
        }

        this._controllers.forEach((controller) => {
            controller.handler(apiRouter);
        });

    }

    public serveClientProductionBuild() {
        this._app.use(express.static(path.resolve("./") + "/build/client"));
            
        this._app.get("*", (req: Request, res: Response) => {
            res.sendFile("index.html", {root: path.resolve("./") + "/build/client/"});
         });
    }
}