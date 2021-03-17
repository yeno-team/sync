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
            try {
                const rooms = await this._client.hvalsAsync("rooms");

                // Parse all the string values as json
                const roomsJsonified: IRoom[] = rooms.map((room) => JSON.parse(room));

                return resolve(roomsJsonified);
            } catch(e) {
                return reject(e);
            }
        })
        
    }

    addRoom(roomData: IRoom): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            try {
                const setCommand = await this._client.hsetAsync(this._roomsKey, roomData.code, JSON.stringify(roomData));
                
                if (setCommand !== 1) {
                    return reject("Unexpected error occured while hset command executed");
                }

                return resolve(roomData);
            } catch(e) {
                return reject(e);
            }
        })    
    }

    removeRoom(roomCode: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const delCommand = await this._client.hdelAsync(this._roomsKey, roomCode);
                
            } catch (e) {
                return reject(e);
            }
        });
    }

    getRoom(roomCode: string): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            try {
                const room = await this._client.hgetAsync(this._roomsKey, roomCode);

                return resolve(JSON.parse(room));
            } catch (e) {
                return reject(e);
            }
        })
    }

    editRoom(roomCode: string, dataName: string, value: any): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            try {
               const room = await this.getRoom(roomCode);
                
               if (room == null) {
                    return reject("editRoom: Room does not exist")
               } 

               room[dataName] = value;

               const setCommand = await this._client.hsetAsync(this._roomsKey, room.code, JSON.stringify(room));

               return resolve(room);
            } catch(e) {
                return reject(e);
            }
        });
    }

    appendUser(roomCode: string, userData: RoomUser): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            try {
                const room = await this.getRoom(roomCode);
                
               if (room == null) {
                    return reject("editRoom: Room does not exist")
               } 

               room.users.push(userData);

               const setCommand = await this._client.hsetAsync(this._roomsKey, room.code, JSON.stringify(room));

               return resolve(room);
            } catch(e) {
                return reject(e);
            }
        });
    }

    removeUser(roomCode: string, socketId: string): Promise<IRoom> {
        return new Promise(async (resolve, reject) => {
            try {
               const room = await this.getRoom(roomCode);
                
               if (room == null) {
                    return reject("editRoom: Room does not exist")
               } 

               room.users = room.users.filter(user => user.socket_id != socketId);

               const setCommand = await this._client.hsetAsync(this._roomsKey, room.code, JSON.stringify(room));

               return resolve(room);
            } catch (e) {
                return reject(e);
            }
        })
    }
}
