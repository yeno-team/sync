import { Server, Socket } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import ChatBotUtility from "src/server/utils/chatBot";

/**
 * Main Chat bot module interface
 */
export interface IChatBot {
    /**
     * gets called everytime a new message is sent to a room with its data
     * @param socket a socket.io server
     * @param messageData RoomChatNewMessage
     */
    onMessage(socket: Server, messageData: RoomChatNewMessage);
}

/**
 * Default Dependencies for Chat Bot
 */
export type IChatBotCommandDependencies = {
    chatBotUtility: ChatBotUtility
}

/**
 * Command for the chat bot
 */
export interface IChatBotCommand {
    /**
     * name of the command
     */
    name: string;
    /**
     * Description of the command
     */
    description: string;
    /**
     * Detailed description of the command, use formatting
     */
    detailedDescription: string;
    /**
     * Main logic of the command using the message data
     * @param socket socket.io Server
     * @param messageData RoomChatNewMessage
     */
    execute(socket: Server, messageData: RoomChatNewMessage);
}

/**
 * Builds a IChatBot using the builder pattern
 */
export interface IChatBotBuilder {
    prefix: string;
    commands: IChatBotCommand[];
    setPrefix(prefix: string);
    setCommands(commands: IChatBotCommand[]);
    build(): IChatBot;
}