import { Server, Socket } from "socket.io";

export interface ISubscriber {
    setUpListeners(socketServer: Server);
}