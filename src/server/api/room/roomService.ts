import { IRoomModule, IRoom } from "src/server/modules/room/types";
import { Logger } from "src/server/modules/logger/logger";
import { RandomUtility } from "src/server/utils/random";
import { VideoSourceUtility } from "src/server/utils/videoSource";

export type RoomServiceDependencies = {
    roomModule: IRoomModule,
    logger: Logger,
    randomUtility: RandomUtility,
    videoSourceUtility: VideoSourceUtility
}

export class RoomService {
    constructor(
        private dependencies: RoomServiceDependencies
    ) {}
    
    public getRoomList = () => this.dependencies.roomModule.getRoomList();
    
    public addRoom(roomData: IRoom): IRoom {
        // Generate code
        const generatedCode = this.dependencies.randomUtility.getRandomString(6).toUpperCase();
        roomData.code = generatedCode;

        return this.dependencies.roomModule.addRoom(roomData);
    }

    public getRoom = (roomCode: string): IRoom => this.dependencies.roomModule.getRoom(roomCode)
}