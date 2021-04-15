import { Server } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RedisModule } from "src/server/modules/redis/redisModule";
import { IPromisifedRedisClient } from "src/server/modules/redis/types";
import { ChatBotUtility } from "src/server/utils";
import { IChatBotCommand } from "../../types";

export type MoneyCommandDependencies = {
    chatBotUtility: ChatBotUtility,
    redis: RedisModule
}

export class MoneyCommand implements IChatBotCommand {
    name: string = "money";
    description: string = "displays how much money is in your session's bank";
    detailedDescription: string = "Money resets after you have disconnected from the socket.";
    private _client: IPromisifedRedisClient;

    constructor(private dependencies: MoneyCommandDependencies) {
        this._client = this.dependencies.redis.getClient();
    }

    async execute(socket: Server, messageData: RoomChatNewMessage) {
        try {
            const money = await this._client.hgetAsync("banks", messageData.sender.socket_id);

            if (money == null) {
                // create a brand new bank account
                const addAccount = await this._client.hsetAsync("banks", messageData.sender.socket_id, JSON.stringify({money: 200}))
                
                if (addAccount !== 1) {
                    return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "Unexpectedly could not create a new bank for you!");
                }

                return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "You have **$200**.")
            }

            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "You have **$" + JSON.parse(money).money + "**.")
        } catch (e) {
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "An unexpected error occured, " + e);
        }
    }
}