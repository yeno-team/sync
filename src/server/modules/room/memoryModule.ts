// @ts-nocheck

import { IRoomModule, IRoom, RoomUserRank, RoomUser } from "./types";

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
        const roomIndex = this.getRoomIndexFromCode(roomCode);
    
        this._rooms[roomIndex][dataName] = value;

        return this._rooms[roomIndex];
    }

    public appendUser(roomCode: string, userData: RoomUser): IRoom {
        const roomIndex = this.getRoomIndexFromCode(roomCode);
    
        this._rooms[roomIndex].users.push(userData);

        return this._rooms[roomIndex];
    }

    public removeUser(roomCode: string, socketId: string): IRoom {
        const roomIndex = this.getRoomIndexFromCode(roomCode);
        
        if (this._rooms[roomIndex]) {
            // Remove the user from the Room's users array
            const filteredUsers = this._rooms[roomIndex].users.filter(user => user.socket_id != socketId);

            // Set room's user to the filtered users 
            this._rooms[roomIndex].users = filteredUsers;
        }

        
        return this._rooms[roomIndex];
    }   

    public removeRoom(roomCode: string) {
        const roomIndex = this.getRoomIndexFromCode(roomCode);
        
        this._rooms.splice(roomIndex, 1);
    }

    /**
     * Find the room's index in the room array
     * @param roomCode 
     */
    private getRoomIndexFromCode = (roomCode: string): number => {
        return this._rooms.map(room => room.code).indexOf(roomCode);
    };

}
