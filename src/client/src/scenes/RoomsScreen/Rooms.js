import React from 'react';
import { useHistory } from 'react-router-dom';

const Rooms = (props) => {
    const history = useHistory()

    return (
        props.rooms && props.rooms.map((room) => (
            <div className="room" data-room-code={room.code} data-room-name={room.name} key={`${room.code}`} onClick={() => history.push(`/room/${room.code}`)}>
                <div className="room-content">
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-description">{room.description}</p>
                </div>
                <div class="room-user-count"><span class="current-users">{room.users.length}</span>/<sub class="max-users">{room.max_users}</sub></div>
            </div>
        ))
    )
}

export default Rooms