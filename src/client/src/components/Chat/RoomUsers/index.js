import React from "react";
import "./index.css";

const RoomUsersComponent = (props) => {
    return (
        <div id="chat__users" className="chat__users">
            <input type="text" id="filter__users" className="filter__users"/>
            
            <section className="broadcast__user" id="broadcast__user">
                <h1 className="chat-section-title">Broadcaster</h1>
                <ul className="room-user-list" id="broadcast-user-list">
                    <li>Khai93</li>
                </ul>
            </section>

            <section className="room__users" id="room__users">
                <h1 className="chat-section-title">Room Users</h1>
                <ul className="room-user-list" id="room-users-list">
                    <li>Lunatite</li>
                    <li>Danny</li>
                    <li>Demonic</li>
                </ul>
            </section>
        </div>
    )
}

export default RoomUsersComponent;