import { join, resolve } from 'path';
import { readdir } from 'fs/promises';
import { ISubscriber } from "src/types/api/ISubscriber";

// Controllers
import { StatusController } from "./status/statusController";
import { RoomController } from "./room/roomController";

// Subscribers
import RoomSubscribers from "./room/subscribers";

// Modules
import LoggerModule from "../modules/logger";
import RoomModule from "../modules/room";
import RequestModule from "../modules/request";
import videoScraperModule from "../modules/videoScraper";

// Utilities
import { RouteUtility, ControllerUtility, RandomUtility} from "../utils";

// Services
import { RoomService } from "./room/roomService";
import chatBot from '../modules/chatBot';


// Dependencies 
const RouteUtilityDep = new RouteUtility({ readdir, pathJoin: join});
const ControllerUtilityDep = new ControllerUtility({ pathResolve: resolve, routeUtility: RouteUtilityDep });
const RandomUtilityDep = new RandomUtility({});

const RoomServiceDep = new RoomService({
    logger: LoggerModule,
    roomModule: RoomModule,
    randomUtility: RandomUtilityDep
});


/**
 * The default dependencies for every controller
 */
const defaultControllerDependencies = { 
    controllerUtility: ControllerUtilityDep,
    logger: LoggerModule
};


/**
 * Export all controllers as an array to inject inside Server.
 * Also creates a new Controller from each of the controller classes with its dependencies.
 */
export const controllers = [
    new StatusController({
        ...defaultControllerDependencies,
        videoScraperModule
    }),
    new RoomController({
        ...defaultControllerDependencies,
        roomService: RoomServiceDep
    })
]

/**
 * Export all subscribers as an array to inject inside SocketServer.
 * Creates a new Subscriber from each of the subscriber classes with its dependencies.
 */
export const subscribers: ISubscriber[] = [
    new RoomSubscribers.RoomSettingsSubscriber({
        roomService: RoomServiceDep,
        videoScraperModule
    }),
    new RoomSubscribers.RoomUserSubscriber({
        roomService: RoomServiceDep
    }),
    new RoomSubscribers.RoomChatSubscriber({
        roomService: RoomServiceDep,
        chatBot: chatBot
    }),
    new RoomSubscribers.RoomVideoSubscriber({
        roomService: RoomServiceDep
    })
];