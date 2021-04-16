import React , { useState , useEffect } from "react";
import useRoomAuth from "../../../hooks/useRoomAuth"
import "./index.css";

const RoomUsersComponent = (props) => {
    const { users } = useRoomAuth(props.code)
    const [ filterUser , setFilterUser ] = useState("");

    // Effect is ran when the users has been changed.
    useEffect(() => {
        console.log(users)
    }, [users])

    return (
        <div id="chat__users" className="chat__users">
            <input type="text" id="filter__users" className="filter__users" onChange={(e) => setFilterUser(e.target.value)} value={filterUser} placeholder="Filter"/>
            
            <section className="broadcast__user" id="broadcast__user">
                <h1 className="chat-section-title">Broadcaster</h1>
                <ul className="room-user-list" id="broadcast-user-list">
                    {/* <li>{ broadcaster.username }</li> */}
                </ul>
            </section>

            <section className="room__users" id="room__users">
                <h1 className="chat-section-title">Users</h1>
                <ul className="room-user-list" id="room-users-list">
                    {/* {users.map((user,index) => <li key={index}> {user.username} </li>)} */}
                </ul>
            </section>
        </div>
    )
}

export default RoomUsersComponent;