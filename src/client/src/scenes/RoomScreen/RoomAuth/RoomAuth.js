import React, { useEffect, useState } from 'react';

import { usePrevious } from '../../../hooks';
import { useAlert } from 'react-alert'

import socketSubscriber from '../../../api/socket/socketSubscriber';

export const RoomAuth = (props) => {
    if (props.setIsAuthenticated === null) {
        throw new Error("RoomAuth component requires 'setIsAuthenticated' method.");
    }

    if (props.isAuthenticated === null) {
        throw new Error("RoomAuth component requires 'isAuthenticated' value.");
    }

    if(props.joinRoom === null) {
        throw new Error("RoomAuth component requires the 'joinRoom' method.")
    }

    if(props.roomErrors === null) {
        throw new Error("RoomAuth component requires the 'roomErrors' value.")
    }

    const setIsAuthenticated = props.setIsAuthenticated;
    const isAuthenticated = props.isAuthenticated;
    const roomData = props.roomData;
    const joinRoom = props.joinRoom;
    const roomErrors = props.roomErrors;
    const username = props.username;
    const setUsernameInputActive = props.setUsernameInputActive;

    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const alert = useAlert();

    const prevUsers = usePrevious(roomData.users);
    const prevErrors = usePrevious(roomErrors);

    // Handle new users
    useEffect(() => {
        if(prevUsers) {
            const newUsers = roomData.users.filter((user, index) => prevUsers[index] !== user);

            if (newUsers.length > 0) {
                newUsers.forEach(user => alert.show("You joined the room!"))
                
                if (submitted && !isAuthenticated) {
                    const clientFound = newUsers.filter(user => socketSubscriber.getSocket().id === user.socketId);
                    if (clientFound.length > 0) {
                        setIsAuthenticated(true);
                    }
                }
            }   
        }
    } , [roomData.users])

    // Handle room errors.
    useEffect(() => {
        if(prevErrors) {
            const newErrors = roomErrors.filter((error, index) => prevErrors[index] !== error);
    
            if (newErrors.length > 0) {
                newErrors.forEach(error => alert.show(error));

                if (newErrors.indexOf("Already Joined") === -1) {
                    setUsernameInputActive(true);
                }

                if (newErrors.indexOf("Incorrect Room Password") !== -1) {
                    setSubmitted(true);
                }
            }
        }    
    }, [roomErrors])

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