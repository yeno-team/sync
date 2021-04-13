import { Server } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { IChatBotCommand, IChatBotCommandDependencies } from "../../types";



export class SitesCommand implements IChatBotCommand {
    name: string = "sites";
    description: string = "Gives link that shows a list of supported websites";
    detailedDescription: string = "There are no arguments";

    constructor(private dependencies: IChatBotCommandDependencies) {}

    execute(socket: Server, messageData: RoomChatNewMessage) {
        this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "(https://github.com/yeno-team/sync/blob/main/docs/supported-sites.md)");
    }
}