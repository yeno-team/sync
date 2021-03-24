import React , { useState , useEffect } from 'react';
import Axios from 'axios';
import CreateRoomForm from './CreateRoomForm';
import Rooms from './Rooms';
import socketSubscriber from '../../api/socket/socketSubscriber';
import './index.css'
import "video-react/dist/video-react.css";

const NEW_ROOM_CREATED_EVENT = "NewRoomCreated";

export const RoomMenu = (props) => {
    const [ search , setSearch ] = useState("")
    const [ rooms , setRooms ] = useState([])
    const [ filteredRooms , setFilteredRooms ] = useState([])
    const [show , setModalShow] = useState(false)
    
    useEffect(() => {
        (async () => {
            // Fetch current rooms
            const req = await Axios({
                url : "http://localhost:8000/api/room/list",
                method : "GET"
            })
    
            setRooms(req.data)
            setFilteredRooms(req.data)
        })()
    } , [])
    
    useEffect(() => {
            socketSubscriber.on(NEW_ROOM_CREATED_EVENT , (data) => {
                setRooms((prevState) => [data , ...prevState])
            });
    
            return () => {
                socketSubscriber.off(NEW_ROOM_CREATED_EVENT)
            }
    } , [])
    

    useEffect(() => {
        const filteredRooms = rooms.filter(({ name , code }) => name.startsWith(search) || code.startsWith(search))
        setFilteredRooms(filteredRooms)
    } , [search])

    return (
        <main>
            <CreateRoomForm show={show} onHide={() => setModalShow(false)} />
            <section class="room-options">
                <button id="create-room-button" onClick={() => setModalShow(true)}>Create A Room</button>
                <p id="or">OR</p>
                <input type="text" name="search-room" id="search-input" placeholder="Search for rooms with text or room code..." onChange={(e) => setSearch(e.target.value)} value={search}/>
             </section>
             <section className="rooms">
                 <Rooms rooms={filteredRooms}/>
             </section>
        </main>
    )
}