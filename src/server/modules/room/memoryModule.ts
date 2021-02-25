import { IRoomModule, IRoom } from "./types";

export type DatabaseModuleDependencies = {

}

export class MemoryRoomModule implements IRoomModule {
    private _rooms: IRoom[];

    constructor() {
        this._rooms = [];
    }

    public getRoomList(): IRoom[] {
        return this._rooms.filter(room => room.is_private == false);
    }

    public addRoom(roomData: IRoom): IRoom {
        this._rooms.push(roomData);

        return roomData;
    }

    public getRoom(roomCode: string): IRoom {
        return this._rooms.filter(room => room.code == roomCode)[0];
    }

    public editRoom(roomCode: string, dataName: string, value: any): IRoom {
        const roomIndex = this._rooms.map(room => room.code).indexOf(roomCode);
    
        this._rooms[roomIndex][dataName] = value;

        return this._rooms[roomIndex];
    }
}