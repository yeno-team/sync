
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
    
                // Get the broadcast user.
                const broadcasterUser = roomUsersArr.find(({rank}) => rank === 0).username
    
                // Get users who are not the broadcast user.
                const roomUsernames = roomUsersArr.filter(({ rank }) => rank === 1).map(({ username }) => username)

                setRoomUsers({
                    broadcast : broadcasterUser,
                    users : [...roomUsernames]
                })
            })
        } catch (e) {
            setErrors((prevState) => [...prevState , "Failed to fetch user information for the current rome."])
        }
    } , [])

    
    // useEffect(() => {
    //     socketSubscriber.on(NEW_USER_JOINED_EVENT, (data) => {
    //         setRoomUsers([...roomUsers, data.user]);
    //     });
        
    //     socketSubscriber.on(USER_LEAVE_EVENT , (data) => {
    //         const usernameLeft = data.username
    //         const index = roomUsers.findIndex(({username}) => usernameLeft === username)

    //         if(index !== -1) {
    //             // Remove the user off the users array.
    //             roomUsers.splice(index , 1)
    //             setRoomUsers([...roomUsers])
    //         }
    //     })

    //     socketSubscriber.on(ERROR_JOIN_EVENT, (data) => {
    //         setErrors([...errors, data.message]);
    //     });

    //     socketSubscriber.on(ERROR_LEAVE_EVENT , (data) => {
    //         setErrors([...errors , data.message])
    //     })

    //     return () => {
    //         socketSubscriber.off(NEW_USER_JOINED_EVENT);
    //         socketSubscriber.off(ERROR_JOIN_EVENT);
    //         socketSubscriber.off(USER_LEAVE_EVENT);
    //         socketSubscriber.off(ERROR_LEAVE_EVENT);
    //     }
    // }, [errors, roomUsers])
    
    const joinRoom = (username, password) => {
        socketSubscriber.emit("UserJoin" , { roomCode, username , password});
    };

    return { users: roomUsers, joinRoom, errors };
}

export default useRoomAuth;