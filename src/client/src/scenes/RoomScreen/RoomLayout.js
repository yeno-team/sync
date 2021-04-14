import React, { useState, useEffect } from 'react';
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
import backArrowIcon from "../../assets/icons/back-arrow.svg";
import settingIcon from "../../assets/icons/settings.svg";
import emoteIcon from "../../assets/icons/happy.svg";
import { RoomAuth } from './RoomAuth/RoomAuth';

const RoomLayoutComponent = (props) => {
    const { code } = useParams();
    const [roomData, setRoomData] = useState();
    const {emotes, getEmote} = useEmotes();
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [settingModalActive, setSettingModalActive] = useState(false);
    const [emoteListActive, setEmoteListActive] = useState(false);

    const username = props.username;
    const setUsername = props.setUsername;

    const chatHeaderElements = [
        <img className="room__chatIcon" src={backArrowIcon} onClick={() => props.history.push("/")}></img>,
        <h4 className="chat__defaultTitle">Chat</h4>,
        <img className="room__chatIcon" src={settingIcon} onClick={() => setSettingModalActive(!settingModalActive)}></img>
    ];

    const chatFormElements = [
        <img className="room__chatEmoteIcon" src={emoteIcon}  onClick={() => setEmoteListActive(!emoteListActive)}></img>
    ]

    async function fetchRoomData() {
        try {
            const response = await getRoomData(code);
            setRoomData(response);

        } catch(e) {
            setRoomData({});
            console.error(e);
        }
    }

    useEffect(() => {
        (async() => {
            if (roomData == null) {
                await fetchRoomData();
            } else {
                if (roomData && roomData.users && roomData.users.length === 0) {
                    
                    await fetchRoomData();
                }
            }
            
        })();
    }, [roomData]);

    const authCheck = isAuthenticated ? 
    <React.Fragment>
        <VideoArea roomData={roomData} />
        <Chat formElements={chatFormElements} headerElements={chatHeaderElements} className="room__chat"/>
        <RoomSettingModal active={settingModalActive} roomData={roomData} />
        <RoomEmoteList active={emoteListActive} setActive={setEmoteListActive} emotes={emotes}/>
    </React.Fragment> :
    <RoomAuth username={username} setUsername={setUsername} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} roomData={roomData}  />

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