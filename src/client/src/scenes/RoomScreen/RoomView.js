import React , { useState , useEffect , useRef } from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import { getRoomData } from "../../api/room/roomService";
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer';
import { Chat } from './Chat';

const ROOM_SETTING_UPDATED_EVENT = "RoomSetttingUpdated";
const ROOM_OWNER_VIDEO_STATE_CHANGED = "RoomOwnerVideoStateChanged";
const ROOM_VIDEO_ERROR = "RoomVideoError";
const ROOM_VIDEO_URL_CHANGED = "RoomVideoUrlChanged";


export const RoomView = (props) => {
    const [ owner , setOwner ] = useState();
    const [ ownerVideoState, setOwnerVideoState] = useState();
    const [ videoState,  setVideoState] = useState();
    const [ player, setPlayer ] = useState();
    const [ started, setStarted ] = useState(false);
    const [ videoSrc, setVideoSrc ] = useState("");
    
    useEffect(() => {
        (async() => {
            try {
                const { users, video_src } = props.roomData;
                
                if (users.length == 0) {
                    return props.setRoomData(await getRoomData(props.roomData.code));
                }
                
                setOwner(users.some((user) => socketSubscriber.getSocket().id === user.socket_id && user.rank === 0))
                setVideoSrc(video_src);
            } catch (e) {
                setOwner(false)
            }
        })()
    } , [props.roomData])

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
                if(Math.abs((data.state.currentTime - videoState.currentTime)) > 1.5) { // Duration Change
                    // If the client is paused, no need to change
                    videoState.paused == false && player.seek(data.state.currentTime);
                }

                if(data.state.muted !== videoState.muted) { // Mute Change
                    player.muted = data.state.muted
                }

                if(data.state.volume !== videoState.volume) { // Volume Change
                    player.volume = data.state.volume
                }

                data.state.paused && player.pause();
                !data.state.paused && player.play();
            }
        });

        socketSubscriber.on(ROOM_VIDEO_URL_CHANGED, (data) => {
            setVideoSrc(data.url);
        })

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
            socketSubscriber.off(ROOM_VIDEO_ERROR);
        }
    } , [videoState, started])
    

    function manualDurationChanged(duration) {
        console.log(duration);
    }

    function VideoResumed() {
        ownerVideoState && player.seek(ownerVideoState.currentTime);
        ownerVideoState && ownerVideoState.paused && player.pause();
    }

    function VideoMuted () {
        if(ownerVideoState) {
            player.muted = ownerVideoState.muted;
        }
    }

    function videoStateChanged(state, prevState, player) {
        setVideoState(state);
        setPlayer(player);

        // Disable functionality for users who aren't the owner.
        if(owner !== null && !owner) {
            if (state.paused === false && prevState.paused === true) {
                VideoResumed();
            }

            if(state.muted !== prevState.muted) {
                VideoMuted();
            }
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
            <VideoPlayer width={800} height={500} src={videoSrc} hideControls={owner !== null && !owner} fluid={false} manualDurationChangeHandler={manualDurationChanged} handleStateChange={videoStateChanged}/>
            <Chat />
        </React.Fragment>
    )
}