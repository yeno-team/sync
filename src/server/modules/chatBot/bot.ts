
import { Server, Socket } from 'socket.io';
import { RoomChatNewMessage } from 'src/server/api/room/subscribers/chat';
import { IChatBot, IChatBotBuilder, IChatBotCommand } from './types';

export class ChatBotModule implements IChatBot {
    private _prefix: string;
    private _commands: IChatBotCommand[];

    constructor(builder: IChatBotBuilder) {
        this._prefix = builder.prefix;
        this._commands = builder.commands;
    }

    onMessage(socket: Server, messageData: RoomChatNewMessage) {
        if (messageData.message.startsWith(this._prefix)) {
            for (const command of this._commands) {
                const commandCalled = messageData.message.split(" ")[0].slice(1);
                
                if (commandCalled.toLowerCase() === command.name.toLowerCase()) {
                    command.execute(socket, messageData);
                }
            }
        }
    }
}