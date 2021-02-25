import { Socket } from "socket.io";
import { ISubscriber } from "src/types/api/ISubscriber";
import { RoomService } from "../roomService";

export type RoomUserSubscriberDependencies = {
    roomService: RoomService
}

export type RoomUserJoinPayload = {
    username: string
}

export class RoomUserSubscriber implements ISubscriber {
    private _socket: Socket;

    constructor(
        private dependencies: RoomUserSubscriberDependencies,
    ) {}

    public setUpListeners(socket: Socket) {
        this._socket = socket;
        
        socket.on("UserJoined", this.onUserJoin);
    }

    private onUserJoin(data: RoomUserJoinPayload) {
        
    }
}