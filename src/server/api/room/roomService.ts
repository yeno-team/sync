import { IDatabaseModule, IRoom } from "src/server/modules/database/types";
import { Logger } from "src/server/modules/logger/logger";

export type RoomServiceDependencies = {
    DbModule: IDatabaseModule,
    logger: Logger
}

export class RoomService {
    constructor(
        private dependencies: RoomServiceDependencies
    ) {}
    
    public getRoomList = () => this.dependencies.DbModule.getRoomList();
    
    public addRoom(roomData: IRoom): IRoom {
        // MAKE CODE GENERATE
        //throw new Error("Code is not generated");
        return this.dependencies.DbModule.addRoom(roomData);
    }

    public getRoom = (roomCode: string): IRoom => this.dependencies.DbModule.getRoom(roomCode)
}