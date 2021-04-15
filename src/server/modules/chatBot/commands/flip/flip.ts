import { Server } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RedisModule } from "src/server/modules/redis/redisModule";
import { IPromisifedRedisClient } from "src/server/modules/redis/types";
import { ChatBotUtility, RandomUtility } from "src/server/utils";
import { IChatBotCommand } from "../../types";

export type FlipCommandDependencies = {
    chatBotUtility: ChatBotUtility,
    redis: RedisModule,
    randomUtility: RandomUtility
}

export class FlipCommand implements IChatBotCommand {
    name: string = "flip";
    description: string = "flip a coin, winning if it lands on heads";
    detailedDescription: string = "/flip [money]\n Ex. **/flip 89** would flip 89 dollars";
    private _client: IPromisifedRedisClient;

    constructor(private dependencies: FlipCommandDependencies) {
        this._client = this.dependencies.redis.getClient();
    }

    async execute(socket: Server, messageData: RoomChatNewMessage) {
        try {
            const { args } = this.dependencies.chatBotUtility.parseRoomMessageData(messageData);

            const flipAmount = args[0] && parseInt(args[0]) || 0;

            let bank = await this._client.hgetAsync("banks", messageData.sender.socket_id);

            if (bank == null) {
                // create a brand new bank account
                const addAccount = await this._client.hsetAsync("banks", messageData.sender.socket_id, JSON.stringify({money: 200}))
                
                if (addAccount !== 1) {
                    return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "Unexpectedly could not create a new bank for you!");
                }

                bank = JSON.stringify({money: 200});
            }

            const parsedBank = JSON.parse(bank);

            if (flipAmount > parsedBank.money) {
                return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, `You do not have enough money to flip this amount.`)
            }   

            const randomNumber = this.dependencies.randomUtility.getRandomInteger(1, 2);

            if (randomNumber == 1) {
                const setCommand = await this._client.hsetAsync("banks", messageData.sender.socket_id, JSON.stringify({money: parsedBank.money + (flipAmount * 2)}));
                return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, `Its **Heads!** You won **${flipAmount * 2}**.`)
            } else {
                const setCommand = await this._client.hsetAsync("banks", messageData.sender.socket_id, JSON.stringify({money: parsedBank.money - flipAmount}));
                return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, `Its **Tails!** You lost **${flipAmount}**.`)
            }
        } catch (e) {
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "An unexpected error occured, " + e);
        }
    }
}