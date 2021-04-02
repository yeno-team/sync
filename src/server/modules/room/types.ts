export enum RoomUserRank {
    "owner",
    "user",
    "bot"
}

export type RoomUser = {
    socket_id: string,
    rank: RoomUserRank,
    username: string
}

export type IRoom = {
    code: string,
    name: string,
    description : string,
    max_users: number,
    users: RoomUser[],
    room_password: string,
    video_src: string,
    is_private: boolean
}

export interface IRoomModule {
     /**
     * Returns the list of public rooms
     */
    getRoomList(): Promise<IRoom[]>;

    /**
     * Adds a new room
     * @param roomData Type IRoom data for the room to be added
     */
    addRoom(roomData: IRoom): Promise<IRoom>;

    /**
     * Removes a room
     * @param roomCode 
     */
    removeRoom(roomCode: string);
    
    /**
     * Get a room by room code
     * @param roomCode
     */
    getRoom(roomCode: string): Promise<IRoom>

    /**
     * Edits a room's specified data
     * @param roomCode 
     * @param dataName The name of the property that is being edited
     * @param value The value the data is being edited to
     * @returns the edited room
     */
    editRoom(roomCode: string, dataName: string, value: any): Promise<IRoom>

    /**
     * Appends a User to the room's user list
     * @param roomCode 
     * @param userData Appended user's data typeof RoomUser
     * @returns Updated IRoom Object
     */
    appendUser(roomCode: string, userData: RoomUser): Promise<IRoom>

    /**
     * Remove a user from a room's user list
     * @param roomCode 
     * @param socketId Removed user's socketId
     * @returns Updated IRoom Object
     */
    removeUser(roomCode: string, socketId: string): Promise<IRoom>
}
