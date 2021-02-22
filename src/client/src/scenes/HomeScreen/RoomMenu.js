import React from 'react';
import Button from '../../components/Button/'
import './index.css'

export const RoomMenu = (props) => {
    return (
        <main className="main-content" style={{"text-align" : "center"}}>
            <section className="join-rooms">
                <Button text="Create Room!" className="btn-primary"/>
                <h2 style={{"marginTop" : "0px"}}>Join Rooms!</h2>
                <div className="rooms">
                    <div className="room-123">
                        <h3 className="room-name">Anime Room <span className="users">3/8</span></h3>
                        <p className="room-description">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit vel nostrum impedit velit praesentium iste ea perferendis voluptatem est esse.</p>
                    </div>
                    <div className="room-23">
                        <h3 className="room-name">Roblox SuperDuper Gamer <span className="users">8/8</span></h3>
                        <p className="room-description">Roblox is the best game ever created.</p>
                    </div>
                    <div className="room-123">
                        <h3 className="room-name">DanTDM Fan Club <span className="users">2/8</span></h3>
                        <p className="room-description">Roblox is the best game ever created.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}