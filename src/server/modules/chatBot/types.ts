import { Server, Socket } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import ChatBotUtility from "src/server/utils/chatBot";

export interface IChatBot {
    onMessage(socket: Server, messageData: RoomChatNewMessage);
}

export type IChatBotCommandDependencies = {
    chatBotUtility: ChatBotUtility
}

export interface IChatBotCommand {
    name: string;
    description: string;
    detailedDescription: string;
    
    execute(socket: Server, messageData: RoomChatNewMessage);
}

export interface IChatBotBuilder {
    prefix: string;
    commands: IChatBotCommand[];
    setPrefix(prefix: string);
    setCommands(commands: IChatBotCommand[]);
    build(): IChatBot;
}