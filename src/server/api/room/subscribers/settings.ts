import { Server, Socket } from "socket.io";
import { RoomUserRank } from "src/server/modules/room/types";
import { ISubscriber } from "src/types/api/ISubscriber";
import { RoomService } from "../roomService";

export type RoomSettingsSubscriberDependencies = {
    roomService: RoomService
}

export type RoomSettingChangedPayload = {
    roomCode: string,
    settingName: string,
    value: any
}

export class RoomSettingsSubscriber implements ISubscriber {
    private _socketServer: Server;

    constructor(
        private dependencies: RoomSettingsSubscriberDependencies,
    ) {}

    public setUpListeners(socketServer: Server) {
        this._socketServer = socketServer;

        socketServer.on('connection', (socket) => {
            socket.on('RoomSettingChanged', (data: RoomSettingChangedPayload) => this.onSettingsChanged(socket, data));
        });
    }

    private onSettingsChanged(socket: Socket, data: RoomSettingChangedPayload) {
        const roomData = this.dependencies.roomService.getRoom(data.roomCode);

        if (roomData) {
            /**  
             * Find the user emitting the event in the users list 
            */
            const user = roomData.users.filter((user) => user.socket_id === socket.id)

            // const owner = roomData.users.filter(user => user.rank === RoomUserRank.owner);
            
            /**
             * Check if the user is the owner
             * @emits RoomSettingChangeError if user is not the owner
             */

            if (user && user[0].rank !== 0) {
                return socket.emit("RoomSettingChangeError", { message: "Only the room's owner can change settings" });
            } else { 
                /**
                 * If the user who emitted this event cannot be found inside room users.
                 * @emits RoomSettingChangeError - If the user cannot be found inside room users.
                 */
                return socket.emit("RoomSettingChangeError" , { message : "Can't find the user who emitted this event."})
            }




            this.dependencies.roomService.editRoomSetting(data);
        } else {
            return socket.emit("RoomJoinError", { message: "Room does not exist" });
        }
    }
}