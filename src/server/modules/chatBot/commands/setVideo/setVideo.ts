import { Server, Socket } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { ChatBotUtility } from "src/server/utils";
import {IChatBotCommand, IChatBotCommandDependencies } from "../../types";

export interface SetVideoCommandDependencies {
    chatBotUtility: ChatBotUtility,
    
}

export class SetVideoCommand implements IChatBotCommand {
    name: string = "setVideo";
    description: string = "Changes the current video playing.";
    detailedDescription: string = "To change the url of the video do **/setVideo [videoUrl]** with a supported site.\n\n**Example:** /setVideo &https://www.youtube.com/watch?v=9G7SIaZasfE&";

    constructor(private dependencies: SetVideoCommandDependencies) {}


    execute(socket: Server, messageData: RoomChatNewMessage) {
        
    }

}