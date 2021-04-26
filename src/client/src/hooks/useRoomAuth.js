
import { useEffect, useState } from "react";
import socketSubscriber from '../api/socket/socketSubscriber';
import { getRoomData } from '../api/room/roomService';

const NEW_USER_JOINED_EVENT = "RoomUserJoined";
const USER_LEAVE_EVENT = "RoomUserLeave";
const ERROR_JOIN_EVENT = "RoomJoinError";
const ERROR_LEAVE_EVENT = "RoomLeaveError";

const useRoomAuth = (roomCode) => {
    const [roomData, setRoomData] = useState({
        broadcaster : null,
        users : [],
        max_users : 5,
        is_private : false,
        roomCode : null
    });
    
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        try {
            (async () => {
                const { is_private , max_users , users , name , description , video_src } = await getRoomData(roomCode)
                
                // Get the broadcast user object.
                const broadcasterUserObj = users.find(({rank}) => rank === 0)

                setRoomData({
                    broadcaster : broadcasterUserObj,
                    users : [...users],
                    max_users,
                    is_private,
                    roomCode,
                    name,
                    description,
                    video_src
                })
            })()
        } catch (e) {
            setErrors((prevState) => [...prevState , "Failed to fetch user information for the current room."])
        }
    } , [])

    useEffect(() => {
        socketSubscriber.on(NEW_USER_JOINED_EVENT , (data) => {
            const { user } = data
            
            setRoomData((prevState) => ({
                broadcaster : !roomData.broadcaster && user.rank === 0 ? user : prevState.broadcaster,
                users : [...prevState.users , user],
                max_users : prevState.max_users,
                is_private : prevState.is_private,
                roomCode : prevState.roomCode,
                name : prevState.name,
                description : prevState.description,
                video_src : prevState.video_src
            }))
        })

        socketSubscriber.on(USER_LEAVE_EVENT , (data) => {
            const { username : username1 } = data;

            // Find the user who left in the user array.
            const findUserIndex = roomData.users.findIndex(({username}) => username === username1)

            if(findUserIndex !== -1) {
                const copyUserArray = [...roomData.users]

                // Remove the user fromn the array.
                copyUserArray.splice(findUserIndex , 1)

                setRoomData((prevState) => ({
                    broadcaster : prevState.broadcaster,
                    users : [...copyUserArray],
                    max_users : prevState.max_users,
                    is_private : prevState.is_private,
                    roomCode : prevState.roomCode,
                    name : prevState.name,
                    description : prevState.description,
                    video_src : prevState.video_src
                }))
            }
        })

        socketSubscriber.on(ERROR_JOIN_EVENT, (data) => {
            setErrors([...errors, data.message]);
        })

        socketSubscriber.on(ERROR_LEAVE_EVENT , (data) => {
            setErrors([...errors , data.message])
        })

        return () => {
            socketSubscriber.off(NEW_USER_JOINED_EVENT);
            socketSubscriber.off(ERROR_JOIN_EVENT);
            socketSubscriber.off(USER_LEAVE_EVENT);
            socketSubscriber.off(ERROR_LEAVE_EVENT);
        }
    } , [ roomData , errors ])
    
    const joinRoom = (username, password) => {
        socketSubscriber.emit("UserJoin" , { roomCode, username , password});
    };

    return { roomData , joinRoom, errors };
}

export default useRoomAuth;