
import { useEffect, useState } from "react";

import socketSubscriber from '../api/socket/socketSubscriber';

const NEW_USER_JOINED_EVENT = "RoomUserJoined";
const ERROR_EVENT = "RoomJoinError";

const useRoomAuth = (roomCode) => {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        socketSubscriber.on(NEW_USER_JOINED_EVENT, (data) => {
            setUsers([...users, data.user]);
        });
    
        socketSubscriber.on(ERROR_EVENT, (data) => {
            setErrors([...errors, data.message]);
        });

        return () => {
            socketSubscriber.off(NEW_USER_JOINED_EVENT);
            socketSubscriber.off(ERROR_EVENT);
        }
    }, [])
    


    const joinRoom = (username, password) => {
        socketSubscriber.emit("UserJoin" , { roomCode, username , password});
    };

    return { users, joinRoom, errors };
}

export default useRoomAuth;