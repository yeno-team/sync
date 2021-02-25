import { Server } from "socket.io";
import { ISubscriber } from "src/types/subscribers/ISubscriber";
import { RoomService } from "../roomService";

export type RoomSettingsSubscriberDependencies = {
    roomService: RoomService
}

export class RoomSettingsSubscriber implements ISubscriber {
    private _socketServer: Server;

    constructor(
        private dependencies: RoomSettingsSubscriberDependencies,
    ) {}

    public injectSocketServer(socketServer: Server) {
        this._socketServer = socketServer;
    }


}