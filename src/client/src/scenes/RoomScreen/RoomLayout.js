import React, { useState, useEffect, useRef } from 'react';
import { useHistory , useParams } from 'react-router-dom'
import { useRoomAuth, usePrevious, useEmotes } from '../../hooks';
import { VideoArea } from './VideoArea/VideoArea';
import RoomSettingModal from './RoomSettingModal/';
import RoomEmoteList from './RoomEmoteList';
import { getRoomData } from '../../api/room/roomService'
import socketSubscriber from '../../api/socket/socketSubscriber';
import { withRouter } from "react-router-dom";

import './Room.css';
import Chat from '../../components/Chat/';
import InputScreen from '../../components/InputScreen';
import settingIcon from "../../assets/icons/settings.svg";
import emoteIcon from "../../assets/icons/happy.svg";
import userIcon from '../../assets/icons/users.svg';
import { RoomAuth } from './RoomAuth/RoomAuth';

const RoomLayoutComponent = (props) => {
    const { code } = useParams();
    const [roomData, setRoomData] = useState(null);
    const {emotes, getEmote} = useEmotes();
    const inputRef = useRef();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [settingModalActive, setSettingModalActive] = useState(false);
    const [emoteListActive, setEmoteListActive] = useState(false);
    const [usernameInputActive, setUsernameInputActive] = useState(true);
    const [chatInputValue, setChatInputValue] = useState("");
    const [username, setUsername] = useState("");
    const [ viewComponent , setViewComponent ] = useState("chat");

    const chatHeaderElements = [
        <img src={userIcon} alt="userIcon" className="room__chatIcon" onClick={() => viewComponent === "chat" ? setViewComponent("roomUsers") : setViewComponent("chat")}/>,
        <h4 className="chat__defaultTitle">Chat</h4>,
        <img className="room__chatIcon" alt="settingIcon" src={settingIcon} onClick={() => setSettingModalActive(!settingModalActive)}></img>,
    ];

    const chatFormElements = [
        <img className="room__chatEmoteIcon" src={emoteIcon}  onClick={() => setEmoteListActive(!emoteListActive)}></img>
    ]

    async function fetchRoomData() {
        try {   
            const response = await getRoomData(code);
            setRoomData(response);
        } catch(e) {
            setRoomData(null);
            console.error(e);
        }
    }

    useEffect(() => {
        (async() => {
            if(!roomData) {
                await fetchRoomData()
            }
        })()
    }, [roomData])

    useEffect(() => {
        // Check if the user socket id is currently in this room. If so , authenticate the user.
        if(roomData) {
            const findUserInRoom = roomData.users.find(user => user.socket_id === socketSubscriber.getSocket().id)

            if(findUserInRoom) {
                setIsAuthenticated(true)
            }
        }
    }, [roomData])

    const authCheck = isAuthenticated ? 
    <React.Fragment>
        <VideoArea roomData={roomData} />
        <Chat messageText={chatInputValue} setMessageText={setChatInputValue} formElements={chatFormElements} headerElements={chatHeaderElements} roomData={roomData} viewComponent={viewComponent} setViewComponent={setViewComponent} className="room__chat"/>
        <RoomSettingModal active={settingModalActive} roomData={roomData} />
        <RoomEmoteList chatInputvalue={chatInputValue} setChatInputValue={setChatInputValue} inputRef={inputRef} active={emoteListActive} setActive={setEmoteListActive} emotes={emotes}/>
    </React.Fragment> : (
        usernameInputActive ? 
        <InputScreen inputName="Username" value={username} setValue={setUsername} active={usernameInputActive} setActive={setUsernameInputActive}/> :
        <RoomAuth username={username} roomData={roomData} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUsernameInputActive={setUsernameInputActive}/>
    )
    
    
    return (
        <div className="room__layout">
            {
                roomData == null ? 
                <p>Loading</p> : (
                    roomData && Object.keys(roomData).length === 0 && roomData.constructor === Object ?
                    <div className="room__layoutMessage">
                        <p>Room does not exist</p> 
                        <a href="/">Go back home</a>
                    </div>:
                    {...authCheck}
                )
            }
        </div>
    )
}

export const RoomLayout = withRouter(RoomLayoutComponent);