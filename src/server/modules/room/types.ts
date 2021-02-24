export type IRoom = {
    code: string,
    name: string,
    max_users: number,
    users: string[],
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
     * @param roomData Data for the room to be added
     */
    addRoom(roomData: IRoom): IRoom;
    
    /**
     * Get a room by room code
     * @param roomCode
     */
    getRoom(roomCode: string): IRoom
}
