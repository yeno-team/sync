import { Server } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { ChatBotUtility, RandomUtility } from "src/server/utils";
import { IChatBotCommand } from "../../types";


export interface RollCommandDependencies {
    chatBotUtility: ChatBotUtility,
    randomUtility: RandomUtility
}

export class RollCommand implements IChatBotCommand {
    name: string = "roll";
    description: string = "roll a random number based on a max number";
    detailedDescription: string = "Provide a number to be used as a max, Default: 100\n\nExample: /roll 50";

    constructor(private dependencies: RollCommandDependencies) {}

    execute(socket: Server, messageData: RoomChatNewMessage) {
        const { args } = this.dependencies.chatBotUtility.parseRoomMessageData(messageData);

        const randomNumber = this.dependencies.randomUtility.getRandomInteger(0, args[0] ? parseInt(args[0]) : 100);

        if (args[0] && isNaN(parseInt(args[0])) ) {
            // is not a valid integer
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "You gave a invalid integer!!");
            return;
        }

        const messages = [
            `You rolled **${randomNumber}**!`,
            `**${randomNumber}**.`,
            `**${randomNumber}** is your number.`,
            `Do you like your **${randomNumber}** peepoHappy`,
            `KEKW **${randomNumber}**`,
            `Seems like you got a **${randomNumber}**`
        ]

        this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, messages[this.dependencies.randomUtility.getRandomInteger(0, messages.length-1)]);
    }

}