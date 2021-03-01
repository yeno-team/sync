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
import { RequestModule } from "../modules/request";

// Utilities
import { RouteUtility } from "../utils/routes";
import { ControllerUtility } from "../utils/controllers";
import { RandomUtility } from "../utils/random";
import { VideoSourceUtility } from "../utils/videoSource";

// Services
import { RoomService } from "./room/roomService";


// Dependencies 
const RouteUtilityDep = new RouteUtility({ readdir, pathJoin: join, logger: LoggerModule});
const ControllerUtilityDep = new ControllerUtility({ pathResolve: resolve, routeUtility: RouteUtilityDep });
const RandomUtilityDep = new RandomUtility({});
const VideoSourceUtilityDep = new VideoSourceUtility({ requestModule: RequestModule })
const RoomServiceDep = new RoomService({
    logger: LoggerModule,
    roomModule: RoomModule,
    randomUtility: RandomUtilityDep,
    videoSourceUtility: VideoSourceUtilityDep
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
    new StatusController(defaultControllerDependencies),
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
        roomService: RoomServiceDep
    }),
    new RoomSubscribers.RoomUserSubscriber({
        roomService: RoomServiceDep
    }),
    new RoomSubscribers.RoomChatSubscriber({
        roomService: RoomServiceDep
    })
];