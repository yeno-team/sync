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
            socket.on('ChatSendMessage', (data: RoomChatSendMessagePayload) => this.onChatSendMessage(socket, data));
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
        const userData = roomData.users.filter(user => user.socket_id === socket.id);

        /**
         * Check if user was found in the room's user list
         * @emits RoomChatError if user was not found in the room's user list
         */
        if (userData && userData.length == 0) {
            return socket.emit("RoomChatError", { message: "Currently not apart of the room" });
        }
        
        /**
         * @emits RoomChatError if message is empty
         */
        if (!data.message || data.message == '') {
            return socket.emit("RoomChatError", { message: "Cannot send an empty message" });
        }

        this._socketServer.to(roomData.code).emit("RoomChatNewMessage", 
            { 
                sender: {
                    socketId: socket.id,
                    username: userData[0].username
                },
                message: data.message
        });
    }

    
}