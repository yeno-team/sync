export enum RoomUserRank {
    "owner",
    "user"
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
    is_private: boolean
}

export interface IRoomModule {
     /**
     * Returns the list of public rooms
     */
    getRoomList(): IRoom[];

    /**
     * Adds a new room
     * @param roomData Type IRoom data for the room to be added
     */
    addRoom(roomData: IRoom): IRoom;

    /**
     * Removes a room
     * @param roomCode 
     */
    removeRoom(roomCode: string);
    
    /**
     * Get a room by room code
     * @param roomCode
     */
    getRoom(roomCode: string): IRoom

    /**
     * Edits a room's specified data
     * @param roomCode 
     * @param dataName The name of the property that is being edited
     * @param value The value the data is being edited to
     * @returns the edited room
     */
    editRoom(roomCode: string, dataName: string, value: any): IRoom

    /**
     * Appends a User to the room's user list
     * @param roomCode 
     * @param userData Appended user's data typeof RoomUser
     * @returns Updated IRoom Object
     */
    appendUser(roomCode: string, userData: RoomUser): IRoom

    /**
     * Remove a user from a room's user list
     * @param roomCode 
     * @param socketId Removed user's socketId
     * @returns Updated IRoom Object
     */
    removeUser(roomCode: string, socketId: string): IRoom
}
