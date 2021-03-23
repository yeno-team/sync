import { Server, Socket } from "socket.io";
import { RoomUserRank } from "src/server/modules/room/types";
import { VideoSourceUtility } from "src/server/utils/videoSource";
import { ISubscriber } from "src/types/api/ISubscriber";
import { RoomService } from "../roomService";

export type RoomSettingsSubscriberDependencies = {
    roomService: RoomService,
    videoSourceUtility: VideoSourceUtility
}

export type RoomSettingChangedPayload = {
    roomCode: string,
    settingName: string,
    value: any
}

export type RoomVideoUrlChangePayload = {
    roomCode: string,
    url: string
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
            socket.on('RoomVideoUrlChange', (data: RoomVideoUrlChangePayload) => this.onVideoUrlChange(socket, data))
        });
    }

    private async onVideoUrlChange(socket: Socket, data: RoomVideoUrlChangePayload) {
        const roomData = await this.dependencies.roomService.getRoom(data.roomCode);

        /**
         * Check if room exists
         * @emits RoomJoinError if room doesn't exist
         */
        if (!roomData) {
            return socket.emit("RoomJoinError", { message: "Room does not exist" });
        }

        /**  
        * Find the user emitting the event in the users list 
        */
        const user = roomData.users.filter((user) => user.socket_id === socket.id)

        /**
        * Check if the user is the owner
        * @emits RoomSettingChangeError if user is not the owner
        */
            
        if (user && user[0].rank !== 0) {
            return socket.emit("RoomSettingChangeError", { message: "Only the room's owner can change settings" });
        }   

        try {
            const videoSource = await this.dependencies.videoSourceUtility.getVideoSource(data.url);

            if (!videoSource || videoSource && videoSource.length === 0) {
                return socket.emit("RoomSettingChangeError", { message: "Could not grab video source" });
            }

            const roomSettingData: RoomSettingChangedPayload = {
                roomCode: roomData.code,
                settingName: "video_src",
                value: videoSource[0]
            }

            const updatedRoom = await this.dependencies.roomService.editRoomSetting(roomSettingData);

            /**
             * If a IRoom is not returned, that means it couldn't change the data
             * @emits RoomSettingChangeError 
             */
            if (!updatedRoom) {
                return socket.emit("RoomSettingChangeError", { message: "Unexpectedly could not change setting" });
            }

            return this._socketServer.to(roomData.code).emit("RoomVideoUrlChanged", { url: videoSource[0] });
        } catch(e) {
            return socket.emit("RoomSettingChangeError", { message: e.message });
        }


        
    }

    private async onSettingsChanged(socket: Socket, data: RoomSettingChangedPayload) {
        const roomData = await this.dependencies.roomService.getRoom(data.roomCode);

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
            }   

            const updatedRoom = await this.dependencies.roomService.editRoomSetting(data);

            /**
             * If a IRoom is not returned, that means it couldn't change the data
             * @emits RoomSettingChangeError 
             */
            if (!updatedRoom) {
                return socket.emit("RoomSettingChangeError", { message: "Unexpectedly could not change setting" });
            }

            const safeData = {
                name: updatedRoom.name,
                description: updatedRoom.description,
                max_users: updatedRoom.max_users,
                is_private: updatedRoom.is_private
            }

            return this._socketServer.to(roomData.code).emit("RoomSetttingUpdated", safeData);
        } else {
            return socket.emit("RoomJoinError", { message: "Room does not exist" });
        }
    }
}