import React , { useState , useEffect } from 'react'
import socketSubscriber from '../../api/socket/socketSubscriber'
import { } from 'react-bootstrap/Form'

const ROOM_SETTING_CHANGE_EVENT = "RoomSettingChanged"
const ROOM_SETTING_CHANGE_ERROR = "RoomSettingChangeError"

function OwnerPanel(props) {
    const [newRoomName , setNewRoomName] = useState("")

    useEffect(() => {
        socketSubscriber.on(ROOM_SETTING_CHANGE_ERROR , (data) => {
            console.log(data)
        })
    })

    const changeRoomName = () => {
        socketSubscriber.emit(ROOM_SETTING_CHANGE_EVENT , {roomCode : props.roomCode , settingName : "name" , value : newRoomName })        
        setNewRoomName("")
    }

    return (
        <section>
            <input type="text" placeholder="Room Name" onChange={(e) => setNewRoomName(e.target.value)} value={newRoomName}/>
            <button onClick={changeRoomName}>Set Room Name</button>
        </section>
    )
}

export default OwnerPanel
    