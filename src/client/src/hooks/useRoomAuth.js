import { useEffect, useState } from "react";
import socketSubscriber from '../api/socket/socketSubscriber';
import { getRoomData } from '../api/room/roomService';

const NEW_USER_JOINED_EVENT = "RoomUserJoined";
const USER_LEAVE_EVENT = "RoomUserLeave";
const ERROR_JOIN_EVENT = "RoomJoinError";
const ERROR_LEAVE_EVENT = "RoomLeaveError";

const useRoomAuth = (roomCode) => {
    const [roomUsers, setRoomUsers] = useState({
        broadcaster : null,
        users : []
    });
    
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        try {
            (async () => {
                const roomData = await getRoomData(roomCode)
                const roomUsersArr = roomData.users

                // Get the broadcast user object.
                const broadcasterUserObj = roomUsersArr.find(({rank}) => rank === 0)
    
                // Get users who are not the broadcast user.
                const roomUsernamesObj = roomUsersArr.filter(({ rank }) => rank === 1)

                setRoomUsers({
                    broadcaster : broadcasterUserObj,
                    users : [...roomUsernamesObj]
                })
            })()
        } catch (e) {
            setErrors((prevState) => [...prevState , "Failed to fetch user information for the current rome."])
        }
    } , [])


    useEffect(() => {
        socketSubscriber.on(NEW_USER_JOINED_EVENT , (data) => {
            const { user } = data

            setRoomUsers((prevState) => ({
                broadcaster : prevState.broadcaster,
                users : [...prevState.users , user]
            }))
        })

        socketSubscriber.on(USER_LEAVE_EVENT , (data) => {
            const { username : username1 } = data;

            // Find the user who left in the user array.
            const findUserIndex = roomUsers.users.findIndex(({username}) => username === username1)

            if(findUserIndex !== -1) {
                const copyUserArray = [...roomUsers.users]

                // Remove the user fromn the array.
                copyUserArray.splice(findUserIndex , 1)

                setRoomUsers((prevState) => ({
                    broadcaster : prevState.broadcaster,
                    users : [...copyUserArray]
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
    } , [ roomUsers , errors ])
    
    const joinRoom = (username, password) => {
        socketSubscriber.emit("UserJoin" , { roomCode, username , password});
    };

    return { roomUsers, joinRoom, errors };
}

export default useRoomAuth;