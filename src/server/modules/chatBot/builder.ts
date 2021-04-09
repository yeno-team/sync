import { ChatBotModule } from './bot';
import { IChatBotBuilder, IChatBotCommand, IChatBot } from './types';

export class ChatBotBuilder implements IChatBotBuilder {
    private _prefix: string = "/";
    private _commands: IChatBotCommand[] = [];

    setPrefix(prefix: string) {
        this._prefix = prefix;
        return this;
    }

    setCommands(commands: IChatBotCommand[]) {
        this._commands = commands;
        return this;
    }

    build(): IChatBot {
        return new ChatBotModule(this);
    }

    get prefix() {
        return this._prefix;
    }

    get commands() {
        return this._commands;
    }
}