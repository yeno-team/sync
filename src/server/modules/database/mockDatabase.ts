import { IDatabaseModule, IRoom } from "./types";

export type DatabaseModuleDependencies = {

}

export class DatabaseModule implements IDatabaseModule {
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
}