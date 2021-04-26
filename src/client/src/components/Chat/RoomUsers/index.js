import React , { useState , useEffect } from "react";
import Button from '../../Button';
import "./index.css";

const RoomUsersComponent = (props) => {
    const { roomData , setViewComponent } = props;
    const [ currentBroadcaster , setCurrentBroadcaster ] = useState(null);
    const [ currentRoomUsers , setCurrentRoomUsers ] = useState([]);
    const [ filterVal , setFilterVal ] = useState("");
    const [ filterUsers , setFilterUsers ] = useState([]);
    const filterInput = document.getElementById("filter__users");

    useEffect(() => {
        const broadcasterUser = roomData.broadcaster.username

        if(broadcasterUser !== currentBroadcaster) {
            setCurrentBroadcaster(broadcasterUser)
        }
        
        const roomUserObjects = roomData.users
        const roomUsers = roomUserObjects.filter(({ rank }) => rank === 1).map(({username}) => username)

        if(currentRoomUsers.length !== roomUsers.length) {
            setCurrentRoomUsers([...roomUsers])
        }
    } , [roomData.broadcaster , roomData.users])
    
    useEffect(() => filterInput && filterInput.focus() , [filterInput])

    const filterInputChange = (e) => {
        const val = e.target.value
        
        const filteredUsernames = currentRoomUsers.filter((username) => username.includes(val))
        setFilterVal(val)
        setFilterUsers(filteredUsernames)
    }    

    return (
        <React.Fragment>
            <div id="chat__user__title">Room Users</div>
            <Button variant="green" id="chat__user__close" onClick={() => setViewComponent("chat")}>Close</Button>
            <div id="chat__users" className="chat__users">
                <input type="text" id="filter__users" className="filter__users" onChange={filterInputChange} value={filterVal} placeholder="Filter"/>
                
                <section className="broadcast__user" id="broadcast__user">
                    <h1 className="chat-section-title">Broadcaster</h1>
                    <ul className="room-user-list" id="broadcast-user-list">
                        <li>{ currentBroadcaster?.includes(filterVal) && currentBroadcaster }</li>
                    </ul>
                </section>

                <section className="room__users" id="room__users">
                    <h1 className="chat-section-title">Users</h1>
                    <ul className="room-user-list" id="room-users-list">
                        {
                            filterVal ? 
                            filterUsers.map((username , index) => <li key={index}>{username}</li>) :
                            currentRoomUsers.map((username , index) => <li key={index}>{username}</li>)
                        }
                    </ul>
                </section>
        </div>
        </React.Fragment>
    )
}

export default RoomUsersComponent;