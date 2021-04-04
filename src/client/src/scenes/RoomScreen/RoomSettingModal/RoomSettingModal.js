import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

import socketSubscriber from '../../../api/socket/socketSubscriber';


import './RoomSettingModal.css';

const ROOM_SETTING_CHANGE_EVENT = "RoomSettingChanged";
const ROOM_VIDEO_URL_CHANGE_EVENT = "RoomVideoUrlChange"
const ROOM_SETTING_CHANGE_ERROR = "RoomSettingChangeError";

export const RoomSettingModal = (props) => {
    const [roomNameInput, setRoomNameInput] = useState();
    const [roomDescInput, setRoomDescInput] = useState();
    const [isPrivateInput, setIsPrivateInput] = useState();
    const [passwordInput, setPasswordInput] = useState("");
    const [maxUserInput, setMaxUserInput] = useState();
    const [initialized, setintialized] = useState(false);
    const alert = useAlert();
    
    const active = props.active;
    const roomData = props.roomData;
    
    if (roomData && !initialized) {
        setRoomNameInput(roomData.name);
        setRoomDescInput(roomData.description);
        setIsPrivateInput(roomData.is_private);
        setMaxUserInput(roomData.max_users);
        setintialized(true);
    } 

    useEffect(() => {
        socketSubscriber.on(ROOM_SETTING_CHANGE_ERROR , (data) => {
           alert.show(data.message, {
               type: 'error'
           });
        })

        return () => {
            socketSubscriber.off(ROOM_SETTING_CHANGE_ERROR);
        }
    } , [])

    const inputMethods = {
        "RoomNameInput": (target) => { setRoomNameInput(target.value) },
        "RoomDescInput": (target) => { setRoomDescInput(target.value) },
        "RoomMaxUserInput": (target) => { setMaxUserInput(target.value) },
        "isPrivateInput": (target) => { setIsPrivateInput(target.checked) },
        "RoomPasswordInput": (target) => { setPasswordInput(target.value) }
    }

    const handleChange = (e) => {
        inputMethods[e.target.id](e.target);
    }

    const emitChangeSetting = (name, value) => {
        socketSubscriber.emit(ROOM_SETTING_CHANGE_EVENT , {roomCode : roomData.code , settingName : name , value : value })
    }

    const handleSubmit = () => {
           if (roomNameInput !== roomData.name) {
                emitChangeSetting("name", roomNameInput);
           }

           if (roomDescInput !== roomData.description) {
                emitChangeSetting("description", roomNameInput);
           }

           if (isPrivateInput !== roomData.is_private) {
               emitChangeSetting("is_private", isPrivateInput);
           }

           if (maxUserInput !== roomData.max_users) {
               emitChangeSetting("max_users", maxUserInput);
           }

           if (passwordInput !== "") {
               emitChangeSetting("password", passwordInput);
               setPasswordInput("");
           }

           alert.show("Applied Settings.");
    }

    return (
        <React.Fragment>
            {
                active && 
                <div className="roomSettingModal__ctn">
                    <h2>Room Settings</h2>
                    <input type="text" id="RoomNameInput" placeholder="Room Name..." vlaue={roomNameInput} onChange={handleChange} />
                    <input type="text" id="RoomDescInput" placeholder="Room Description..." value={roomDescInput} onChange={handleChange} />
                    <input type="number" id="RoomMaxUserInput" name="RoomMaxUserInput" value={maxUserInput} placeholder="Max Users" min="1" max="500" onChange={handleChange} />
                    <input type="checkbox" id="isPrivateInput" name="isPrivateInput" value={isPrivateInput} onChange={handleChange}/>
                    <label for="isPrivateInput">Private</label>
                    <input type="password" disabled={!isPrivateInput} id="RoomPasswordInput" placeholder="Room Password..." value={passwordInput} onChange={handleChange}/>
                    <input type="submit" id="RoomApplyBtn" value="Apply Changes" onClick={handleSubmit}/>
                </div>
            }
        </React.Fragment>
        
    )
}