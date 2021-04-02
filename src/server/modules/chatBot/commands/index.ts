import HelpCommand from "./help";
import SetVideoCommand from "./setVideo";

import { ChatBotUtility } from '../../../utils/';

const ChatBotUtilityDep = new ChatBotUtility({});

export default [
    new HelpCommand({chatBotUtility: ChatBotUtilityDep}),
    new SetVideoCommand({chatBotUtility: ChatBotUtilityDep})
];