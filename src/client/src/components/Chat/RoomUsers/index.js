import React , { useState , useEffect } from "react";
import { getRoomData } from "../../../api/room/roomService"
import useRoomAuth from "../../../hooks/useRoomAuth";
import "./index.css";

const RoomUsersComponent = (props) => {
    const { code } = props;
    const { users } = useRoomAuth(code);
    const [ broadcaster , setBroadcaster ] = useState(null);
    const [ roomUsers , setRoomUsers ] = useState([]);
    const [ filterUser , setFilterUser ] = useState("");
    
    useEffect(() => {
        (async () => {
            try {
                const roomData = await getRoomData(code)
                const roomUsersArr = roomData.users

                // Find the broadcaster user.
                const broadcaster = roomUsersArr.find(({rank}) => rank === 0).username
                setBroadcaster(broadcaster)                 

                // Returns all the usernames who aren't a broadcaster of the current room.
                const roomUsernames = roomUsersArr.filter(({ rank }) => rank === 1).map(({ username }) => username)
                setRoomUsers(roomUsernames)
            } catch (e) {
                console.error(e)
            }
        })()
    } , [])

    useEffect(() => {
        const newUsers = users.filter(({username}) => !roomUsers.includes(username)).map(({ username }) => username)
        setRoomUsers((prevState) => [...prevState , ...newUsers])
    }, [users])

    return (
        <div id="chat__users" className="chat__users">
            <input type="text" id="filter__users" className="filter__users" onChange={(e) => setFilterUser(e.target.value)} value={filterUser} placeholder="Filter"/>
            
            <section className="broadcast__user" id="broadcast__user">
                <h1 className="chat-section-title">Broadcaster</h1>
                <ul className="room-user-list" id="broadcast-user-list">
                    <li>{ broadcaster }</li>
                </ul>
            </section>

            <section className="room__users" id="room__users">
                <h1 className="chat-section-title">Users</h1>
                <ul className="room-user-list" id="room-users-list">
                    {roomUsers.map((username , index) => <li key={index}>{username}</li>)}
                </ul>
            </section>
        </div>
    )
}

export default RoomUsersComponent;