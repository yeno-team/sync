import { IRoomModule, IRoom, RoomUserRank, RoomUser } from "src/server/modules/room/types";
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
    name = 1,
    description,
    max_users,
    room_password,
    is_private,
    video_src
}

export class RoomService {
    constructor(
        private dependencies: RoomServiceDependencies
    ) {}
    
    public getRoomList = async () => await this.dependencies.roomModule.getRoomList();
    
    public async addRoom(roomData: IRoom): Promise<IRoom> {
        // Generate code
        const generatedCode = await this.dependencies.randomUtility.getRandomString(6);
        roomData.code = generatedCode.toUpperCase();

        return await this.dependencies.roomModule.addRoom(roomData);
    }

    public removeRoom = (roomCode: string)  => this.dependencies.roomModule.removeRoom(roomCode);
    public getRoom = async (roomCode: string): Promise<IRoom> => await this.dependencies.roomModule.getRoom(roomCode);

    public editRoomSetting = (data: RoomSettingChangedPayload) => {
        const RoomSettingEnum = RoomSetting[data.settingName];

        if (RoomSettingEnum) {
            return this.dependencies.roomModule.editRoom(data.roomCode, data.settingName, data.value);
        }
    }

    public appendUserToRoom = async (roomCode: string, socket_id: string, rank: RoomUserRank, username: string) => {
        const userData: RoomUser = {
            socket_id,
            rank,
            username
        };

        const roomData = await this.getRoom(roomCode);

        if (roomData.users.length < roomData.max_users) {
            await this.dependencies.roomModule.appendUser(roomCode, userData);
        }
    }

    public removeUserFromRoom = async (roomCode: string, socketId: string) => await this.dependencies.roomModule.removeUser(roomCode, socketId);
}