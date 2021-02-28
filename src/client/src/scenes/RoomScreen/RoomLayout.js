import React  , { useState , useEffect } from 'react';
import socketIOClient from "socket.io-client";
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer/videoPlayer';
const ENDPOINT = "http://localhost:51282";

export const RoomLayout = (props) => {
    useEffect(() => {
        // const socket = io("http://localhost:8080")
        // console.log(socket)
        const socket = socketIOClient(ENDPOINT);
    }, [])
    
    function emitDurationChangeEvent() {
        // call duration change socket event
    }

    // check modal

    return (
        <div>
            <OwnerPanel/>
            <VideoPlayer src="http://media.w3.org/2010/05/video/movie_300.webm" fluid={false} manualDurationChangeHandler={emitDurationChangeEvent}/>
        </div>
    )
}