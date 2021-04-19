import { filter } from "bluebird";
import { cpuUsage } from "process";
import React , { useState , useEffect , useRef } from "react";
import { getRoomData } from "../../../api/room/roomService"
import useRoomAuth from "../../../hooks/useRoomAuth";
import "./index.css";

const RoomUsersComponent = (props) => {
    const { code } = props;
    const { users } = useRoomAuth(code);
    const [ broadcasterUser , setBroadcastUser ] = useState(null);
    const [ roomUsers , setRoomUsers ] = useState([]);
    const [ filterVal , setFilterVal ] = useState("");
    const [ filterUsers , setFilterUsers ] = useState([]);

    let baseRoomUsers = [];
    let filterInput = null;

    useEffect(() => {
        (async () => {
            try {
                const roomData = await getRoomData(code)
                const roomUsersArr = roomData.users

                // Find the broadcaster user.
                const broadcaster = roomUsersArr.find(({rank}) => rank === 0).username
                setBroadcastUser(broadcaster)                 

                // Returns all the usernames who aren't a broadcaster of the current room.
                const roomUsernames = roomUsersArr.filter(({ rank }) => rank === 1).map(({ username }) => username)
                baseRoomUsers = roomUsernames

                setRoomUsers(baseRoomUsers)
            } catch (e) {
                console.error(e)
            }
        })()
    } , [])

    useEffect(() => filterInput && filterInput.focus() , [filterInput])

    useEffect(() => {
        const roomAuthUsers = users.map(({ username }) => username)
        setRoomUsers([...baseRoomUsers , ...roomAuthUsers])
    }, [users])

    const filterInputChange = (e) => {
        const val = e.target.value
        
        const filteredUsernames = roomUsers.filter((username) => username.includes(val))
        setFilterVal(val)
        setFilterUsers(filteredUsernames)
    }    

    return (
        <div id="chat__users" className="chat__users">
            <input type="text" id="filter__users" className="filter__users" onChange={filterInputChange} value={filterVal} ref={(ele) => (filterInput = ele)} placeholder="Filter"/>
            
            <section className="broadcast__user" id="broadcast__user">
                <h1 className="chat-section-title">Broadcaster</h1>
                <ul className="room-user-list" id="broadcast-user-list">
                    <li>{ broadcasterUser?.includes(filterVal) && broadcasterUser}</li>
                </ul>
            </section>

            <section className="room__users" id="room__users">
                <h1 className="chat-section-title">Users</h1>
                <ul className="room-user-list" id="room-users-list">
                    {
                        filterVal ? 
                        filterUsers.map((username , index) => <li key={index}>{username}</li>) :
                        roomUsers.map((username , index) => <li key={index}>{username}</li>)
                    }
                </ul>
            </section>
        </div>
    )
}

export default RoomUsersComponent;