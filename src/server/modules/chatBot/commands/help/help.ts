import { Server, Socket } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RoomUserRank } from "src/server/modules/room/types";
import { IChatBotCommand, IChatBotCommandDependencies } from "../../types";
import commands from '../index';

export class HelpCommand implements IChatBotCommand {
    name: string = "help";
    description: string = "displays information about the usage of the commands included in the bot.";
    detailedDescription: string = "To get more info about a command, do **/help [commandName]**";

    constructor(private dependencies: IChatBotCommandDependencies) {}

    execute(socket: Server, messageData: RoomChatNewMessage) {
        const splitMessage = messageData.message.split(" ");
        const prefix = splitMessage[0].charAt(0);
        const args = splitMessage.slice(1);

        const commandHelpList = commands.map(command => `**${prefix}${command.name} ->** ${command.description}\n`);

        const helpMessage = "To get more info about a command, do **/help [commandName]**\n\n" + commandHelpList;

        if (args.length > 0) {
            const command = commands.find(command => command.name.toLowerCase() === args[0].toLowerCase());

            if (command) {
                this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, command.detailedDescription)
            } else {
                this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "You provided an incorrect command name!");
            }
            
        } else {
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, helpMessage);
        }
    }
}