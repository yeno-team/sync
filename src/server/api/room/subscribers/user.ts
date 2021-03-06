
import { Server, Socket } from "socket.io";
import { RoomUser, RoomUserRank } from "src/server/modules/room/types";
import { ISubscriber } from "src/types/api/ISubscriber";
import { RoomService } from "../roomService";
import cheerio from "cheerio";

export type RoomUserSubscriberDependencies = {
    roomService: RoomService
}

export type RoomUserJoinPayload = {
    roomCode: string,
    username: string,
    password: string
}

export type RoomUserLeavePayload = {
    roomCode: string
}

export type RoomCreatedPayload = {
    roomCode : string,
}

export class RoomUserSubscriber implements ISubscriber {

    private _socketServer: Server;

    constructor(
        private dependencies: RoomUserSubscriberDependencies,
    ) {}

    public setUpListeners(socketServer: Server) {
        this._socketServer = socketServer;

        socketServer.on('connection', (socket) => {
            socket.on("UserJoin", (data: RoomUserJoinPayload) => this.onUserJoin(socket, data));
            socket.on("RoomCreated" , (data : RoomCreatedPayload) => this.onNewRoomCreated(socket , data))
            socket.on("UserLeave", (data: RoomUserLeavePayload) => this.onUserLeave(socket, data));
            socket.on("disconnecting", (reason) => this.onSocketDisconnecting(socket, reason));
        });

    }

    private async onNewRoomCreated(socket : Socket , data : RoomCreatedPayload) {
        const roomData = await this.dependencies.roomService.getRoom(data.roomCode)

        if(!roomData.is_private) {
            this._socketServer.emit("NewRoomCreated" , roomData)
        }
    }

    private async onUserJoin(socket: Socket, data: RoomUserJoinPayload) {
        const roomData = await this.dependencies.roomService.getRoom(data.roomCode);

        if (roomData) {
            /**
            * If the room is private,
            * check if the password is incorrect,
            * the owner bypasses this
            * @emits RoomJoinError event if incorrect
            */
            if (roomData.is_private && roomData.room_password != data.password && roomData.users.length > 0) {
                return socket.emit("RoomJoinError", { message: "Incorrect Room Password" });
            }

            /**
             * Check if room's user length is at its max capacity
             * @emits RoomJoinError if room is full 
             */
            if (roomData.users.length === roomData.max_users) {
                return socket.emit("RoomJoinError", { message: "Room is full" });
            }

            const userFound = roomData.users.filter((user) => user.socket_id === socket.id);

            /**
             * Checks if user already joined the room
             * @emits RoomJoinError if already joined
             */
            if (userFound.length > 0) {
                return socket.emit("RoomJoinError", { message: "Already Joined" });
            }

            /***
             * Validate the username
             * @emits RoomJoinError if username is invalid
             */
            if (!/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/g.test(data.username)) {
                return socket.emit("RoomJoinError", {message: "Username is not 4 - 20 characters or has unsupported special characters."})
            }

            socket.join(roomData.code);

            const user : RoomUser = {
                socket_id : socket.id,
                rank : roomData.users.length === 0 ? RoomUserRank.owner : RoomUserRank.user,
                username : data.username
            }
            
            /**
             * Add a user to the room.
             */
            await this.dependencies.roomService.appendUserToRoom(roomData.code, user.socket_id, user.rank , user.username);

            /**
            * @emits RoomUserJoined when a user has joined, broadcast to a room that they have joined
            */
            this._socketServer.to(roomData.code).emit("RoomUserJoined", { user: { socketId: user.socket_id, username: user.username , rank : user.rank }});

        } else {
            return socket.emit("RoomJoinError", { message: "Room does not exist" });
        }
    }

    private async onUserLeave(socket: Socket, data: RoomUserLeavePayload) {
        const roomData = await this.dependencies.roomService.getRoom(data.roomCode);

        if (roomData) {
            const userData = roomData.users.filter(user => user.socket_id === socket.id);

            /**
             * Check if user was found in the room's user list
             * @emits RoomLeaveError if user was not found in the room's user list
             */
            if (userData && userData.length == 0) {
                return socket.emit("RoomLeaveError", { message: "Cannot request to leave before joining the room" });
            }

            if (userData[0].rank === RoomUserRank.owner) {
                 /**
                  * @emits RoomRemoved if owner left
                  */
                 socket.to(roomData.code).emit("RoomRemoved", { message: "Owner of the room has left" });
                
                 /**
                  * Remove the room from the database
                  */
                this.dependencies.roomService.removeRoom(roomData.code);

                /**
                 * Make every other socket leave the socket room,
                 * Which causes the deletion of the room
                 */
                this._socketServer.sockets.sockets.forEach(socket => {
                    if (socket.rooms.has(roomData.code)) {
                        socket.leave(roomData.code);
                    }
                });
            } else {
                socket.leave(roomData.code);

                /**
                 * @emits RoomUserLeave if user left
                 */
                socket.to(roomData.code).emit("RoomUserLeave", { username : userData[0].username ,  message: `${userData[0].username} has left the room` });

                this.dependencies.roomService.removeUserFromRoom(roomData.code, socket.id);
            }
        } else {
            return socket.emit("RoomJoinError", { message: "Room does not exist" });
        }
    }

    private onSocketDisconnecting(socket: Socket, reason: string) {
        if (reason === "ping timeout") {
            // hi sir i am roblox man
        } else {
            /**
             * Leave rooms
             */
            socket.rooms.forEach(roomCode => {
                this.onUserLeave(socket, { roomCode });
            });
        }
    }
}