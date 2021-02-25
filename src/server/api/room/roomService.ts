import { IRoomModule, IRoom } from "src/server/modules/room/types";
import { Logger } from "src/server/modules/logger/logger";
import { RandomUtility } from "src/server/utils/random";
import { VideoSourceUtility } from "src/server/utils/videoSource";
import { RoomSettingChangedPayload } from "./subscribers/settings";

export type RoomServiceDependencies = {
    roomModule: IRoomModule,
    logger: Logger,
    randomUtility: RandomUtility,
    videoSourceUtility: VideoSourceUtility
}

export enum RoomSetting {
    Name,
    MaxUsers,
    RoomPassword,
    IsPrivate
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

    public editRoomSetting = (data: RoomSettingChangedPayload) => {
        const RoomSettingEnum = RoomSetting[data.settingName];

        if (RoomSettingEnum) {
            this.dependencies.roomModule.editRoom(data.roomCode, data.settingName, data.value);
        }
    }
}