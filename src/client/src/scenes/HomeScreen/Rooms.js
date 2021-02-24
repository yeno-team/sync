import React from 'react'
import Badge from 'react-bootstrap/Badge'

const Rooms = (props) => {
    return (
        [{"code":"B6B0639B3796","name":"room 1","max_users":5,"users":[],"room_password":"","is_private":false , "description": "i hate my life"},{"code":"ABE9FE576D58","name":"sex room","max_users":5,"users":[],"room_password":"","is_private":false , "description" : "join for free sex :3"},{"code":"9E5F7679B7AE","name":"anime room","max_users":5,"users":[1,2],"room_password":"","is_private":false , "description" : "we will play roblox here"},{"code":"32BAB4764F32","name":"watch room","max_users":5,"users":[],"room_password":"","is_private":false , "description" : "watching stuff..."},{"code":"42FCE018BF03","name":"some room","max_users":2,"users":[],"room_password":"","is_private":false , "description" : "me and my friend are watching the bee movie."},{"code":"C093ABA72FA8","name":"party room","max_users":1000,"users":[],"room_password":"","is_private":false , "description" : "yes this is a party we will talk about roblox and how to get free shit."}].map((room) => (
            <div className="room" data-room-code={`${room.code}`} key={`${room.code}`}>
                <h3 className="room-name">{room.name}<Badge variant="primary">{room.users.length}/{room.max_users}</Badge></h3>
                <p className="room-description">{room.description}</p>
            </div>
        ))
    )
}

export default Rooms