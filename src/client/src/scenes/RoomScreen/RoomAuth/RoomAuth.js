import React, { useEffect, useState } from 'react';

import { useRoomAuth, usePrevious } from '../../../hooks';
import { useAlert } from 'react-alert'

import socketSubscriber from '../../../api/socket/socketSubscriber';

export const RoomAuth = (props) => {
    if (props.setIsAuthenticated === null) {
        throw new Error("RoomAuth component requires 'setIsAuthenticated' method");
    }

    if (props.isAuthenticated === null) {
        throw new Error("RoomAuth component requires 'isAuthenticated' value");
    }

    const setIsAuthenticated = props.setIsAuthenticated;
    const isAuthenticated = props.isAuthenticated;
    const roomData = props.roomData;
    const username = props.username;
    const setUsernameInputActive = props.setUsernameInputActive;

    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { users, joinRoom, errors } = useRoomAuth(roomData.code);
    const alert = useAlert();
    const prevUsers = usePrevious(users);
    const prevErrors = usePrevious(errors);

    useEffect(() => {
        const newUsers = users.filter((user, index) => prevUsers[index] !== user);
        const newErrors = errors.filter((error, index) => prevErrors[index] !== error);

        if (newUsers.length > 0) {
            // new user joined

            newUsers.map(user => alert.show("You joined the room!"))

            if (submitted && !isAuthenticated) {
                const clientFound = newUsers.filter(user => socketSubscriber.getSocket().id === user.socketId);
                if (clientFound.length > 0) {
                    setIsAuthenticated(true);
                }
            }
        }   
    
        if (newErrors.length > 0) {
            newErrors.map(error => alert.show(error));

            if (newErrors.indexOf("Already Joined") === -1) {
                setUsernameInputActive(true);
            }

            if (newErrors.indexOf("Incorrect Room Password") !== -1) {
                setSubmitted(true);
            }
        }    
    }, [users, errors]);

    useEffect(() => {
        if (roomData.is_private === false && roomData.users.length === 0 && isAuthenticated === false) {           
            joinRoom(username, "");
            setSubmitted(true);
        } else if (roomData.users.length > 0) {
           
            const clientFound = roomData.users.filter(user => socketSubscriber.getSocket().id === user.socket_id);

            if (clientFound.length > 0) {
                setSubmitted(true);
                setIsAuthenticated(true);
            } else if (isAuthenticated === false && roomData.is_private === false) {
                joinRoom(username, "");
                setSubmitted(true);
            }
        }
    }, []);

    const handleChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = () => {
        joinRoom(username, password);
        setSubmitted(true);
    }

    const keyDownHandler = (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <React.Fragment>
            {
                isAuthenticated ?
                null :
                <div className="inputScreen__main">
                    <div>
                        <h3>Enter Room Password</h3>
                        <input type="password" placeholder={`Password...`} value={password} onChange={handleChange} onKeyDown={keyDownHandler}/>
                        <button id="auth__button" onClick={handleSubmit}>Join</button>
                    </div>
                </div>
            }
        </React.Fragment>
        
    )
}