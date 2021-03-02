import { Router } from "express";
import { Server } from "socket.io";

/**
 * Controller interface
 * 
 */
export interface IController {
    /**
     *  Handles the routing of all the routes for the controller
    */ 
    handler(app: Router): void
}