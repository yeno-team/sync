import React, { useState, useEffect } from 'react';
import { useHistory , useParams } from 'react-router-dom'

import { VideoArea } from './VideoArea';
import { getRoomData } from '../../api/room/roomService'

import './room.css';

export const RoomLayout = (props) => {
    const { code } = useParams();
    const [roomData, setRoomData] = useState();

    const username = props.username;

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
        fetchRoomData();
    }, []);

    if (roomData && roomData.users && roomData.users.length == 0) {
        fetchRoomData();
    }

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
                    <React.Fragment>
                        <VideoArea roomData={roomData} />
                    </React.Fragment>
                )
            }
        </div>
    )
}