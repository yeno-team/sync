import { Server, Socket } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RoomUserRank } from "src/server/modules/room/types";

/**
 * Dependencies for ChatBotUtility class
 */
export type ChatBotUtilityDependencies = {
    
}

/**
 * Utility functions to help with chat bot
 */
export class ChatBotUtility {
    /**
     * Sets the dependencies type as a private variable of the class
     * @param dependencies 
     */
    constructor(
        private dependencies: ChatBotUtilityDependencies
    ) {}
    

    public sendMessage(socket: Server, roomCode: string, message: string): void {
        const payload: RoomChatNewMessage = {
            sender: {
                socket_id: "0",
                rank: RoomUserRank.bot,
                username: "Sync"
            },
            roomCode: roomCode,
            message
        }

        socket.in(roomCode).emit("RoomChatNewMessage", payload);
    }
}