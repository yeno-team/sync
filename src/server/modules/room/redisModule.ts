import { resolve } from "path";
import { runInThisContext } from "vm";
import { RedisModule } from "../redis/redisModule";
import { IPromisifedRedisClient } from "../redis/types";
import { IRoom, IRoomModule, RoomUser } from "./types";

export type RoomRedisModuleDependencies = {
    redis: RedisModule
}

export class RoomRedisModule implements IRoomModule {  
    private _client: IPromisifedRedisClient;
    private _roomsKey: string = "rooms";

    constructor(private dependencies: RoomRedisModuleDependencies) {
        this._client = this.dependencies.redis.getClient();
    }

    getRoomList(): Promise<IRoom[]> {
        return new Promise(async (resolve, reject) => {
            const rooms = await this._client.hvalsAsync("rooms");

            // Parse all the string values as json
            const roomsJsonified: IRoom[] = rooms.map((room) => JSON.parse(room));

            return resolve(roomsJsonified);
        })
    }

    addRoom(roomData: IRoom): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            const setCommand = await this._client.hsetAsync(this._roomsKey, roomData.code, JSON.stringify(roomData));
                
            if (setCommand !== 1) {
                return reject("Unexpected error occured while hset command executed");
            }

            return resolve(roomData);
        })    
    }

    removeRoom(roomCode: string) {
        return new Promise(async (resolve, reject) => {
            const delCommand = await this._client.hdelAsync(this._roomsKey, roomCode);
                
            if (delCommand === 0) {
                return reject("Unexpected error occured while hdel command executed");
            }

            resolve(null);
        });
    }

    getRoom(roomCode: string): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            const room = await this._client.hgetAsync(this._roomsKey, roomCode);

            return resolve(JSON.parse(room));
        })
    }

    editRoom(roomCode: string, dataName: string, value: any): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            const room = await this.getRoom(roomCode);
                
            if (room == null) {
                return reject("editRoom: Room does not exist");
            } 

            if (!(room as Object).hasOwnProperty(dataName)) {
                return reject("editRoom: Unknown data name");
            }

            room[dataName] = value;

            const setCommand = await this._client.hsetAsync(this._roomsKey, room.code, JSON.stringify(room));

            return resolve(room);
        });
    }

    appendUser(roomCode: string, userData: RoomUser): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            const room = await this.getRoom(roomCode);
                
            if (room == null) {
                return reject("editRoom: Room does not exist")
            } 

            room.users.push(userData);

            const setCommand = await this._client.hsetAsync(this._roomsKey, room.code, JSON.stringify(room));

            return resolve(room);
        });
    }

    removeUser(roomCode: string, socketId: string): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            const room = await this.getRoom(roomCode);
                
            if (room == null) {
                return reject("editRoom: Room does not exist")
            } 

            room.users = room.users.filter(user => user.socket_id != socketId);

            const setCommand = await this._client.hsetAsync(this._roomsKey, room.code, JSON.stringify(room));

            return resolve(room);
        })
    }
}
