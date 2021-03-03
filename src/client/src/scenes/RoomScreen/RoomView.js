import React , { useState , useEffect , useRef } from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import { getRoomData } from "../../api/room/roomService";
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer';
import { Chat } from './Chat';

const ROOM_SETTING_UPDATED_EVENT = "RoomSetttingUpdated";
const ROOM_OWNER_VIDEO_STATE_CHANGED = "RoomOwnerVideoStateChanged";
const ROOM_VIDEO_ERROR = "RoomVideoError";


export const RoomView = (props) => {
    const [ owner , setOwner ] = useState();
    const [ ownerVideoState, setOwnerVideoState] = useState();
    const [ videoState,  setVideoState] = useState();
    const [ player, setPlayer ] = useState();
    const [ started, setStarted ] = useState(false);
    
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
            
            setOwnerVideoState(data.state);
            
            if (owner != null && !owner) {
                if(Math.abs((data.state.currentTime - videoState.currentTime)) > 1.5) {
                    // If the client is paused, no need to change
                    videoState.paused == false && player.seek(data.state.currentTime);
                }

                data.state.paused && player.pause();
                !data.state.paused && player.play();
            }
        });

        socketSubscriber.on(ROOM_VIDEO_ERROR, (data) => {
            console.log("ERROR: " +  data.message);
        });

        if (videoState && videoState.hasStarted && !started) {
            if (owner !== null && !owner) {
                ownerVideoState && player.seek(ownerVideoState.currentTime);
                player.play();
                setStarted(true);
            }
        }

        return () => {
            socketSubscriber.off(ROOM_SETTING_UPDATED_EVENT);
            socketSubscriber.off(ROOM_OWNER_VIDEO_STATE_CHANGED);
        }
    } , [videoState, started])
    
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
        if(owner !== null && !owner) {
           ownerVideoState && player.seek(ownerVideoState.currentTime);
           ownerVideoState && ownerVideoState.paused && player.pause();
        }
    }

    function videoStateChanged(state, prevState, player) {
        setVideoState(state);
        setPlayer(player);
        
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
            <VideoPlayer src="http://media.w3.org/2010/05/bunny/movie.mp4" hideControls={owner !== null && !owner} fluid={false} manualDurationChangeHandler={manualDurationChanged} handleStateChange={videoStateChanged}/>
            <Chat />
        </React.Fragment>
    )
}