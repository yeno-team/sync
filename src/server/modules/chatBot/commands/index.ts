import HelpCommand from "./help";
import SetVideoCommand from "./setVideo";
import SitesCommand from './sites';
import MoneyCommand from './money'
import FlipCommand from './flip';
import PityCommand from './pity';

import videoScraperModule from '../../videoScraper'

import { ChatBotUtility, RandomUtility } from '../../../utils/';
import { RoomService } from "src/server/api/room/roomService";
import LoggerModule from "../../logger";
import RoomModule from "../../room";
import RedisModule from '../../redis';
import { RollCommand } from "./roll/roll";

const ChatBotUtilityDep = new ChatBotUtility({});
const RandomUtilityDep = new RandomUtility({});

const RoomServiceDep = new RoomService({
    logger: LoggerModule,
    roomModule: RoomModule,
    randomUtility: RandomUtilityDep
});


export default [
    new HelpCommand({chatBotUtility: ChatBotUtilityDep}),
    new SetVideoCommand({chatBotUtility: ChatBotUtilityDep, videoScraperModule, roomService: RoomServiceDep}),
    new RollCommand({chatBotUtility: ChatBotUtilityDep, randomUtility: RandomUtilityDep}),
    new SitesCommand({chatBotUtility: ChatBotUtilityDep}),
    new MoneyCommand({chatBotUtility: ChatBotUtilityDep, redis: RedisModule}),
    new FlipCommand({chatBotUtility: ChatBotUtilityDep, redis: RedisModule, randomUtility: RandomUtilityDep}),
    new PityCommand({chatBotUtility: ChatBotUtilityDep, redis: RedisModule})
];