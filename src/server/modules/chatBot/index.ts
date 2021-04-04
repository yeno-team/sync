import { ChatBotModule } from "./bot";
import { ChatBotBuilder } from "./builder";
import commands from './commands';
import { IChatBot } from "./types";

const chatBot: IChatBot = new ChatBotBuilder()
    .setPrefix('/')
    .setCommands(commands)
    .build();

export default chatBot;

