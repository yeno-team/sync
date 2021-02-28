import React  , { useState , useEffect } from 'react';
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer/videoPlayer';

const socketEndpoint = "http://localhost:51282";

export const RoomLayout = (props) => {
    const { code } = useParams();
    const [isExistingRoom , setIsExistingRoom] = useState(null)
    const [username , setUsername] = useState("")

    const getRoomData = async (code) => {
        try { 
            const req = await Axios({
                url : `http://localhost:8000/api/room/${code}`,
                method : "GET"
            });
            
            if (req.status === 404) {
                setIsExistingRoom(false);
                throw (new Error(req.data.message));
            }

            return req;
          
        } catch (e) {
            // TODO: logge
            console.error(e);
        }
    }

    useEffect(() => {
        (async() => {
            const response = await getRoomData(code)
            
            if(response && response.status === 200) {
                setIsExistingRoom(true)
                
                const socket = io(socketEndpoint);
    
                socket.on("connect" , () => {
                    socket.emit("UserJoin" , { roomCode: code , username : "hi" , password : ""})
                })
    
                socket.on("RoomJoinError" , (data) => console.log(data))
    
                socket.on("RoomUserJoined" , (data) => {
                    console.log(data)
                })
            } else {
                setIsExistingRoom(false);
            }
        })()
    }, [])

    
    function emitDurationChangeEvent() {
        // call duration change socket event
    }

    // check modal

    return (
        <div>
            {isExistingRoom === null ? <h1> Loading.. </h1> : isExistingRoom === false ? <h1>This room doesn't exist</h1>  : <VideoPlayer src="http://media.w3.org/2010/05/bunny/movie.mp4" fluid={false}/>}
        </div>
    )
}