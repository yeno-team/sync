import React , { useState } from 'react';
import CreateRoomForm from './CreateRoomForm';
import Rooms from './Rooms';
import './index.css'
import "video-react/dist/video-react.css";

export const RoomMenu = (props) => {
    const [show , setModalShow] = useState(false)
    
    return (
        <main>
            <CreateRoomForm show={show} onHide={() => setModalShow(false)} />
            <section class="room-options">
                <button id="create-room-button" onClick={() => setModalShow(true)}>Create A Room</button>
                <p id="or">OR</p>
                <input type="text" name="search-room" id="search-input" placeholder="Search for rooms with text or room code..."/>
             </section>
             <section className="rooms">
                 <Rooms/>
             </section>
        </main>
    )
}