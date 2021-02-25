import { Server } from "socket.io";

export interface ISubscriber {
    injectSocketServer(socketServer: Server);
}
