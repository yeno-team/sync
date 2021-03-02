import React , { useState , useEffect } from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import { getRoomData } from "../../api/room/roomService";
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer';
import { Chat } from './Chat';

export const RoomView = (props) => {
    const [ owner , setOwner ] = useState("")

    useEffect(() => {
        (async() => {
            try {
                const { users } = await getRoomData(props.code) // Get updated users list.

                setOwner(true)
                // setOwner(users.some((user) => socketSubscriber.socketId() === user.socket_id && user.rank === 0))
            } catch (e) {
                // log error
                setOwner(false)
            }
        })()
    } , [])

    return (
        <React.Fragment>
            <h3>Room Name : {props.roomData && props.roomData.name}</h3>
            {owner && <OwnerPanel roomCode={props.code}/>}
            <VideoPlayer src="http://media.w3.org/2010/05/bunny/movie.mp4" fluid={false}/>
            <Chat />
        </React.Fragment>
    )
}