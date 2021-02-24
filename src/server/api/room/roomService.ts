import { IRoomModule, IRoom } from "src/server/modules/room/types";
import { Logger } from "src/server/modules/logger/logger";

export type RoomServiceDependencies = {
    roomModule: IRoomModule,
    logger: Logger
}

export class RoomService {
    constructor(
        private dependencies: RoomServiceDependencies
    ) {}
    
    public getRoomList = () => this.dependencies.roomModule.getRoomList();
    
    public addRoom(roomData: IRoom): IRoom {
        // MAKE CODE GENERATE
        //throw new Error("Code is not generated");
        return this.dependencies.roomModule.addRoom(roomData);
    }

    public getRoom = (roomCode: string): IRoom => this.dependencies.roomModule.getRoom(roomCode)
}