import React , { useState , useEffect } from "react";
import { getRoomData } from "../../../api/room/roomService"
import socketSubscriber from "../../../api/socket/socketSubscriber";
import "./index.css";

const NEW_USER_JOINED_EVENT = "RoomUserJoined";
const USER_LEAVE_EVENT = "RoomUserLeave";

const RoomUsersComponent = (props) => {
    const { code } = props;
    const [ broadcasterUser , setBroadcastUser ] = useState(null);
    const [ roomUsers , setRoomUsers ] = useState([]);
    const [ filterVal , setFilterVal ] = useState("");
    const [ filterUsers , setFilterUsers ] = useState([]);
    const filterInput = document.getElementById("filter__users");

    useEffect(() => {
        socketSubscriber.on(NEW_USER_JOINED_EVENT , (data) => {
            const { user : { username } } = data;
            setRoomUsers((prevState) => [...prevState , username])
        })

        socketSubscriber.on(USER_LEAVE_EVENT , (data) => {
            const { username } = data;

            if(roomUsers.length !== 0 && roomUsers.includes(username)) {
                const findUsernameIndex = roomUsers.indexOf(username)
                
                if(findUsernameIndex !== -1) {
                    roomUsers.splice(findUsernameIndex , 1)
                    setRoomUsers([...roomUsers])
                }
            }
        })

        return () => {
            socketSubscriber.off(NEW_USER_JOINED_EVENT)
            socketSubscriber.off(USER_LEAVE_EVENT)
        }
    }, [roomUsers])

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
                setRoomUsers([...roomUsernames])
            } catch (e) {
                console.error(e)
            }
        })()
    } , [])

    useEffect(() => filterInput && filterInput.focus() , [filterInput])

    const filterInputChange = (e) => {
        const val = e.target.value
        
        const filteredUsernames = roomUsers.filter((username) => username.includes(val))
        setFilterVal(val)
        setFilterUsers(filteredUsernames)
    }    

    return (
        <div id="chat__users" className="chat__users">
            <input type="text" id="filter__users" className="filter__users" onChange={filterInputChange} value={filterVal} placeholder="Filter"/>
            
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