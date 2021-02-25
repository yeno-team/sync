import { Server, Socket } from "socket.io";

export interface ISubscriber {
    setUpListeners(socket: Socket);
}