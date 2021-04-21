import React , { useState , useEffect } from "react";
import { getRoomData } from "../../../api/room/roomService"
import socketSubscriber from "../../../api/socket/socketSubscriber";
import "./index.css";

const NEW_USER_JOINED_EVENT = "RoomUserJoined";
const USER_LEAVE_EVENT = "RoomUserLeave";

const RoomUsersComponent = (props) => {
    const { code } = props;
    const [ broadcasterUser , setBroadcastUser ] = useState(null);
    const [ baseRoomUsers , setBaseRoomUsers] = useState([]);
    const [ newRoomUsers , setNewRoomUsers ] = useState([]);
    const [ roomUsers , setRoomUsers ] = useState([]);
    const [ filterVal , setFilterVal ] = useState("");
    const [ filterUsers , setFilterUsers ] = useState([]);
    const filterInput = document.getElementById("filter__users");

    useEffect(() => {
        socketSubscriber.on(NEW_USER_JOINED_EVENT , (data) => {
            const { user : { username } } = data;
            setNewRoomUsers([...newRoomUsers , username])
        })

        socketSubscriber.on(USER_LEAVE_EVENT , (data) => {
            // Look for the username in newUsers and baseRoomUsers array.
            const { username } = data;

            // If the username is found in the baseRoomUsers array we will remove the username.

            if(baseRoomUsers.length !== 0 && baseRoomUsers.includes(username)) {
                const findUsernameIndex = baseRoomUsers.indexOf(username)
                
                if(findUsernameIndex !== -1) {
                    baseRoomUsers.splice(findUsernameIndex , 1)
                    setBaseRoomUsers([...baseRoomUsers])
                }
            
            } else if(newRoomUsers.length !== 0 && newRoomUsers.includes(username)) {
                // If the username is found in newUsers array we will remove the username.

                const findUsernameIndex = newRoomUsers.indexOf(username)

                if(findUsernameIndex !== -1) {
                    newRoomUsers.splice(findUsernameIndex , 1)
                    setNewRoomUsers([...newRoomUsers])
                }
            }
        })

        return () => {
            socketSubscriber.off(NEW_USER_JOINED_EVENT)
            socketSubscriber.off(USER_LEAVE_EVENT)
        }
    }, [baseRoomUsers , newRoomUsers])

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
                setBaseRoomUsers(roomUsernames)
            } catch (e) {
                console.error(e)
            }
        })()
    } , [])

    useEffect(() => {
        setRoomUsers([...baseRoomUsers , ...newRoomUsers])
    } , [baseRoomUsers , newRoomUsers])

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