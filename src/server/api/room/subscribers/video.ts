import { ISubscriber } from "src/types/api/ISubscriber";
import { RoomUserRank } from "src/server/modules/room/types";
import { Server, Socket } from "socket.io";
import { RoomService } from "../roomService";
import { QualityLabel, VideoSourceUtility } from "src/server/utils/videoSource/videoSource";

export type RoomVideoSubscriberDependencies = {
    roomService: RoomService,
    videoSourceUtility: VideoSourceUtility
}

export type RoomVideoState = {
    currentSrc: string,
    duration: number,
    currentTime: number,
    seekingTime: number,
    buffered: any[],
    waiting: boolean,
    seeking: boolean,
    paused: boolean,
    autoPaused: boolean,
    ended: boolean,
    playbackRate: number,
    muted: boolean,
    volume: number,
    readyState: any,
    networkState: any,
    videoWidth: number,
    videoHeight: number,
    hasStated: boolean,
    userActivity: boolean,
    isActive: boolean,
    isFullScreen: boolean,
    videoId: string
}

export type RoomVideoStateChangePayload = {
    roomCode: string,
    state: RoomVideoState
}

export class RoomVideoSubscriber implements ISubscriber {
    private _socketServer: Server;

    constructor(
        private dependencies: RoomVideoSubscriberDependencies,
    ) {}

    public setUpListeners(socketServer: Server) {
        this._socketServer = socketServer;

        socketServer.on('connection', (socket) => {
            socket.on('RoomVideoStateChange', (data: RoomVideoStateChangePayload) => this.onVideoStateChange(socket, data))
        });

    }

    private async onVideoStateChange(socket: Socket, data: RoomVideoStateChangePayload) {
        const roomData = await this.dependencies.roomService.getRoom(data.roomCode);

        /**
         * @emits RoomVideoError if code does not exist
         */
        if (!roomData) {
            return socket.emit("RoomVideoError", { message: "Room does not exist" });
        }


        const userData = roomData.users.filter(user => user.socket_id === socket.id);

        /**
         * Check if user was found in the room's user list
         * @emits RoomChatError if user was not found in the room's user list
         */
        if (userData && userData.length == 0) {
            return socket.emit("RoomVideoError", { message: "Currently not apart of the room" });
        }

        /**
         * Check if user is owner to broadcast the sockets duration to the others
         * @emits RoomOwnerVideoStateChanged if the users rank is owner
         */
        if (userData[0].rank == RoomUserRank.owner) {
            this._socketServer.to(roomData.code).emit("RoomOwnerVideoStateChanged", { state: data.state });
        }
    }
}