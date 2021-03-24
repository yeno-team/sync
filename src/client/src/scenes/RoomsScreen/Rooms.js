import React , { useState , useEffect } from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

const NEW_ROOM_CREATED_EVENT = "NewRoomCreated";

const Rooms = (props) => {
    const [ currentRooms , setCurrentRooms ] = useState([])
    const history = useHistory()

    useEffect(() => {
        (async () => {
            // Fetch current rooms
            const req = await Axios({
                url : "http://localhost:8000/api/room/list",
                method : "GET"
            })

            setCurrentRooms(req.data)
        })()
    } , [])

    useEffect(() => {
        socketSubscriber.on(NEW_ROOM_CREATED_EVENT , (data) => {
            setCurrentRooms((prevState) => [data , ...prevState])
        });

        return () => {
            socketSubscriber.off(NEW_ROOM_CREATED_EVENT)
        }
    } , [])


    return (
        currentRooms.map((room) => (
            <div className="room" data-room-code={room.code} data-room-name={room.name} key={`${room.code}`} onClick={() => history.push(`/room/${room.code}`)}>
                <div className="room-content">
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-description">{room.description}</p>
                </div>
                <div class="room-user-count"><span class="current-users">{room.users.length}</span>/<sub class="max-users">{room.max_users}</sub></div>
            </div>
        ))
    )
}

export default Rooms