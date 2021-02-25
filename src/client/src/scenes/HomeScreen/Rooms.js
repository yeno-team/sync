import React , { useState , useEffect } from 'react'
import Axios from 'axios'
import Badge from 'react-bootstrap/Badge'

const Rooms = (props) => {
    const [ currentRooms , setCurrentRooms ] = useState([])


    useEffect(() => {
        (async () => {
            // Fetch current rooms
            const req = await Axios({
                url : "http://localhost:8080/api/room/list",
                method : "GET"
            })

            setCurrentRooms(req.data)
        })()
    } , [])


    return (
        currentRooms.map((room) => (
            <div className="room" data-room-code={`${room.code}`} key={`${room.code}`}>
                <h3 className="room-name">{room.name}<Badge variant="primary">{room.users.length}/{room.max_users}</Badge></h3>
                <p className="room-description">{room.description}</p>
            </div>
        ))
    )
}

export default Rooms