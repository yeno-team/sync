import React , { useState , useEffect } from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Badge from 'react-bootstrap/Badge';

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
            setCurrentRooms((prevState) => [...prevState , data])
        });

        return () => {
            socketSubscriber.off(NEW_ROOM_CREATED_EVENT)
        }
    } , [])


    return (
        currentRooms.map((room) => (
            <div className="room" key={`${room.code}`} onClick={() => history.push(`/room/${room.code}`)}>
                <h3 className="room-name">{room.name}<Badge variant="primary">{room.users.length}/{room.max_users}</Badge></h3>
                <p className="room-description">{room.description}</p>
            </div>
        ))
    )
}

export default Rooms