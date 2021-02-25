import React , { useState } from 'react';
import JoinRoomForm from './JoinRoomForm';
import Rooms from './Rooms';
import Button from 'react-bootstrap/Button';

import './index.css'

import "video-react/dist/video-react.css";

export const RoomMenu = (props) => {
    const [show , setModalShow] = useState(false)

    return (
        <main className="main-content" style={{"textAlign" : "center"}}>
            <JoinRoomForm show={show} onHide={() => setModalShow(false)} />
            <section className="join-rooms">
                <Button variant="primary" style={{"marginTop" : "5px"}}onClick={() => setModalShow(true)}>Create Room</Button>
                <h2 style={{"marginTop" : "0px"}}>Join Rooms!</h2>
                <div className="rooms">
                   <Rooms/>
                </div>
            </section>
        </main>
    )
}