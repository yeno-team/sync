import { Server } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RedisModule } from "src/server/modules/redis/redisModule";
import { IPromisifedRedisClient } from "src/server/modules/redis/types";
import { ChatBotUtility } from "src/server/utils";
import { IChatBotCommand } from "../../types";

export type PityCommandDependencies = {
    chatBotUtility: ChatBotUtility,
    redis: RedisModule
}

export class PityCommand implements IChatBotCommand {
    name: string = "pity";
    description: string = "give you $1 if you have 0";
    detailedDescription: string = "I pity you.";
    private _client: IPromisifedRedisClient;

    constructor(private dependencies: PityCommandDependencies) {
        this._client = this.dependencies.redis.getClient();
    }

    async execute(socket: Server, messageData: RoomChatNewMessage) {
        try {
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

            if (parsedBank.money === 0) {
                const setCommand = await this._client.hsetAsync("banks", messageData.sender.socket_id, JSON.stringify({money: parsedBank.money + 1}));
                this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "I feel bad for you, heres a dollar.");
            } else {
                this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "Stop asking for handouts.")
            }
        } catch (e) {
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "An unexpected error occured, " + e);
        }
    }
}