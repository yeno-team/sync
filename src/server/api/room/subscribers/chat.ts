import { Server, Socket } from "socket.io";
import { RoomUserRank } from "src/server/modules/room/types";
import { ISubscriber } from "src/types/api/ISubscriber";
import { RoomService } from "../roomService";

export type RoomChatSubscriberDependencies = {
    roomService: RoomService
}

export type RoomChatSendMessagePayload = {
    roomCode: string,
    message: string
}

export class RoomChatSubscriber implements ISubscriber {
    private _socketServer: Server;

    constructor(
        private dependencies: RoomChatSubscriberDependencies,
    ) {}

    public setUpListeners(socketServer: Server) {
        this._socketServer = socketServer;

        socketServer.on('connection', (socket) => {
            
        });

    }

    private onChatSendMessage(socket: Socket, data: RoomChatSendMessagePayload) {
        const roomData = this.dependencies.roomService.getRoom(data.roomCode);

        /**
         * @emits RoomChatError if code does not exist
         */
        if (!roomData) {
            return socket.emit("RoomChatError", { message: "Cannot send message to a room that does not exist" });
        }

        /**
         * @emits RoomChatError if user is not in the room to send the message to
         */
        if (!socket.rooms.has(roomData.code)) {
            return socket.emit("RoomChatError", { message: "Currently not apart of the room" });
        }

        /**
         * @emits RoomChatError if message is empty
         */
        if (!data.message || data.message == '') {
            return socket.emit("RoomChatError", { message: "Cannot send a empty message" });
        }

      

    }

    
}