import { Server, Socket } from "socket.io";
import { RoomService } from "src/server/api/room/roomService";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RoomSettingChangedPayload } from "src/server/api/room/subscribers/settings";
import { IVideoScraper } from "src/server/modules/videoScraper/types";
import { ChatBotUtility } from "src/server/utils";
import {IChatBotCommand, IChatBotCommandDependencies } from "../../types";

export interface SetVideoCommandDependencies {
    chatBotUtility: ChatBotUtility,
    videoScraperModule: IVideoScraper,
    roomService: RoomService
}

export class SetVideoCommand implements IChatBotCommand {
    name: string = "setVideo";
    description: string = "Changes the current video playing.";
    detailedDescription: string = "To change the url of the video do **/setVideo [videoUrl]** with a supported site.\n\n**Example:** /setVideo (https://www.youtube.com/watch?v=9G7SIaZasfE)";

    constructor(private dependencies: SetVideoCommandDependencies) {}

    async execute(socket: Server, messageData: RoomChatNewMessage) {
        try {
            const { args } = this.dependencies.chatBotUtility.parseRoomMessageData(messageData);

            /**
             * Video Url Not Provided
             */
            if (args[0] == null || !args[0]) {
                return this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "Please provide a video url.");
            }

            const roomData = await this.dependencies.roomService.getRoom(messageData.roomCode);

            /**  
            * Find the user emitting the event in the users list 
            */
            const user = roomData.users.filter((user) => user.socket_id === messageData.sender.socket_id);

            /**
            * Check if the user is the owner
            */
            
            if (user && user[0].rank !== 0) {
                throw new Error("You do not have permission");
            }   

            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "Attempting to change video...");
    
            const videoSources = await this.dependencies.videoScraperModule.getVideoSource(args[0]);

          
            if (videoSources.length < 1) {
                throw new Error("Could not get video source");
            }

            const roomSettingData: RoomSettingChangedPayload = {
                roomCode: roomData.code,
                settingName: "video_src",
                value: videoSources[videoSources.length-1]
            }

            const updatedRoom = await this.dependencies.roomService.editRoomSetting(roomSettingData);

            if (!updatedRoom) {
                throw new Error("Unexpectedly could not change video");
            }

            socket.to(roomData.code).emit("RoomVideoUrlChanged", { url: videoSources[videoSources.length-1], sources: videoSources });
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, "Sucessfully changed video.");
        } catch (e) {
            this.dependencies.chatBotUtility.sendMessage(socket, messageData.roomCode, e.message);
        }
    }
}