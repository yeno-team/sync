import HelpCommand from "./help";
import SetVideoCommand from "./setVideo";
import videoScraperModule from '../../videoScraper'

import { ChatBotUtility, RandomUtility } from '../../../utils/';
import { RoomService } from "src/server/api/room/roomService";
import LoggerModule from "../../logger";
import RoomModule from "../../room";

const ChatBotUtilityDep = new ChatBotUtility({});
const RandomUtilityDep = new RandomUtility({});

const RoomServiceDep = new RoomService({
    logger: LoggerModule,
    roomModule: RoomModule,
    randomUtility: RandomUtilityDep
});


export default [
    new HelpCommand({chatBotUtility: ChatBotUtilityDep}),
    new SetVideoCommand({chatBotUtility: ChatBotUtilityDep, videoScraperModule, roomService: RoomServiceDep})
];