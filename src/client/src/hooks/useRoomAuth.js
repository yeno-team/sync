
import { useEffect, useState } from "react";

import socketSubscriber from '../api/socket/socketSubscriber';

const NEW_USER_JOINED_EVENT = "RoomUserJoined";
const USER_LEAVE_EVENT = "RoomUserLeave";
const ERROR_JOIN_EVENT = "RoomJoinError";
const ERROR_LEAVE_EVENT = "RoomLeaveError";

const useRoomAuth = (roomCode) => {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        socketSubscriber.on(NEW_USER_JOINED_EVENT, (data) => {
            setUsers([...users, data.user]);
        });
        
        socketSubscriber.on(USER_LEAVE_EVENT , (data) => {
            const usernameLeft = data.username
            const index = users.findIndex(({username}) => usernameLeft === username)

            if(index !== -1) {
                // Remove the user off the users array.
                users.splice(index , 1)
                setUsers([...users])
            }
        })

        socketSubscriber.on(ERROR_JOIN_EVENT, (data) => {
            setErrors([...errors, data.message]);
        });

        socketSubscriber.on(ERROR_LEAVE_EVENT , (data) => {
            setErrors([...errors , data.message])
        })

        return () => {
            socketSubscriber.off(NEW_USER_JOINED_EVENT);
            socketSubscriber.off(ERROR_JOIN_EVENT);
            socketSubscriber.off(USER_LEAVE_EVENT);
            socketSubscriber.off(ERROR_LEAVE_EVENT);
        }
    }, [errors, users])
    
    const joinRoom = (username, password) => {
        socketSubscriber.emit("UserJoin" , { roomCode, username , password});
    };

    return { users, joinRoom, errors };
}

export default useRoomAuth;