import React , { useState , useEffect , useRef } from 'react'
import socketSubscriber from '../../api/socket/socketSubscriber'
import { } from 'react-bootstrap/Form'

const ROOM_SETTING_CHANGE_EVENT = "RoomSettingChanged";
const ROOM_VIDEO_URL_CHANGE_EVENT = "RoomVideoUrlChange"
const ROOM_SETTING_CHANGE_ERROR = "RoomSettingChangeError";

function OwnerPanel(props) {
    const [ roomSettings , setRoomSettings ] = useState({
        name : "",
        description : "",
        max_users : "5",
        password : "",
        is_private : false
    });
    const [ videoUrl, setVideoUrl ] = useState("");

    useEffect(() => {
        socketSubscriber.on(ROOM_SETTING_CHANGE_ERROR , (data) => {
            console.error(data)
        })

        return () => {
            socketSubscriber.off(ROOM_SETTING_CHANGE_ERROR);
        }
    } , [])

    const handleValueChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.type === "checkbox" ? target.checked : target.value

        setRoomSettings((prevState) => {
            return {
                ...prevState,
                [name] : value
            }
        })
    }

    const changeRoomSetting = (name , value) => {
        socketSubscriber.emit(ROOM_SETTING_CHANGE_EVENT , {roomCode : props.code , settingName : name , value : value })
    }      

    const handleVideoUrlChange = (e) => {
        setVideoUrl(e.target.value);
    }

    const changeVideoUrl = () => {
        socketSubscriber.emit(ROOM_VIDEO_URL_CHANGE_EVENT, { roomCode: props.code, url: videoUrl });
    }

    return (
        <section>
            <div>
                <input type="text" placeholder="Room Name" onChange={handleValueChange} name="name"/>
                <button onClick={() => changeRoomSetting("name" , roomSettings.name)}>Set Room Name</button>
            </div>
            <div>
                <textarea type="text" placeholder="Description" col={3} onChange={handleValueChange} name="description"/>
                <button onClick={() => changeRoomSetting("description" , roomSettings.description)}>Set Room Description</button>
            </div>
            <div>
                <select value={roomSettings.max_users} onChange={handleValueChange} name="max_users">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <button onClick={() => changeRoomSetting("max_users" , parseInt(roomSettings.max_users))}>Set Max Users Limit</button>
            </div>
            <div>
            <input type="text" placeholder="Video URL" onChange={handleVideoUrlChange} name="video_url"/>
                <button onClick={() => changeVideoUrl()}>Set Video Url</button>
            </div>
        </section>
    )
}

export default OwnerPanel
    