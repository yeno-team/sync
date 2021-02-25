import { Server, Socket } from "socket.io";
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
    private _socket: Socket;

    constructor(
        private dependencies: RoomSettingsSubscriberDependencies,
    ) {}

    public setUpListeners(socket: Socket) {
        this._socket = socket;
        socket.on('RoomSettingChanged', this.onSettingsChanged)
    }

    private onSettingsChanged(data: RoomSettingChangedPayload) {
        const roomData = this.dependencies.roomService.getRoom(data.roomCode);

        if (roomData) {
            /**  
             * Find the user emitting the event in the users list 
             * Checking if they are owner or not
            */
            const owner = roomData.users.filter(user => user === "owner_" + this._socket.id);
            
            if (owner) {
                this.dependencies.roomService.editRoomSetting(data);
            }
        }
    }
}