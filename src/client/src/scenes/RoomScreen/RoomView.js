import React , { useState , useEffect , useRef } from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import { getRoomData } from "../../api/room/roomService";
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer';
import { Chat } from './Chat';

const ROOM_SETTING_UPDATED_EVENT = "RoomSetttingUpdated";
const ROOM_OWNER_VIDEO_STATE_CHANGED = "RoomOwnerVideoStateChanged";
const ROOM_VIDEO_ERROR = "RoomVideoError";

// danny was here

export const RoomView = (props) => {
    const [ owner , setOwner ] = useState();
    const [ ownerVideoState, setOwnerVideoState] = useState();
    const [ videoState,  setVideoState] = useState();
    
    useEffect(() => {
        socketSubscriber.on(ROOM_SETTING_UPDATED_EVENT , (data) => {
            props.setRoomData((prevState) => {
                return {
                    ...prevState,
                    ...data
                }
            })
        });
        
        
        socketSubscriber.on(ROOM_OWNER_VIDEO_STATE_CHANGED, (data) => {
            console.log(data.state);
            setOwnerVideoState(data.state);
        });

        socketSubscriber.on(ROOM_VIDEO_ERROR, (data) => {
            console.log("ERROR: " +  data.message);
        });


        return () => {
            socketSubscriber.off(ROOM_SETTING_UPDATED_EVENT);
            socketSubscriber.off(ROOM_OWNER_VIDEO_STATE_CHANGED);
        }
    } , [])
    
    useEffect(() => {
        (async() => {
            try {
                const { users } = await getRoomData(props.roomData.code) // Get updated users list.
                setOwner(users.some((user) => socketSubscriber.getSocket().id === user.socket_id && user.rank === 0))
            } catch (e) {
                setOwner(false)
            }
        })()
    } , [props.roomData])

    function manualDurationChanged(duration) {
        console.log(duration);
    }

    function VideoResumed() {
        console.log('resumed');
    }

    function videoStateChanged(state, prevState) {
        setVideoState(state);
        
        if (state.paused === false && prevState.paused === true) {
            VideoResumed();
        }

        if (owner) {
            socketSubscriber.emit("RoomVideoStateChange", { roomCode: props.roomData.code, state });
        }
    }

    return (
        <React.Fragment>
            <h3>Room Name : {props.roomData && props.roomData.name}</h3>
            <h3> Room Description : {props.roomData && props.roomData.description} </h3>
            {owner && <OwnerPanel code={props.roomData.code}/>}
            <VideoPlayer src="http://media.w3.org/2010/05/bunny/movie.mp4" fluid={false} manualDurationChangeHandler={manualDurationChanged} handleStateChange={videoStateChanged}/>
            <Chat />
        </React.Fragment>
    )
}