import React, {useState, useEffect} from 'react';
import socketSubscriber from '../../../api/socket/socketSubscriber';
import VideoPlayer from '../../../components/VideoPlayer';

const ROOM_SETTING_UPDATED_EVENT = "RoomSetttingUpdated";
const ROOM_OWNER_VIDEO_STATE_CHANGED = "RoomOwnerVideoStateChanged";
const ROOM_VIDEO_ERROR = "RoomVideoError";
const ROOM_VIDEO_URL_CHANGED = "RoomVideoUrlChanged";

export const VideoArea = (props) => {
    const [ isBroadcaster , setIsBroadcaster ] = useState(false);
    const [ ownerVideoState, setOwnerVideoState ] = useState({});
    const [ videoState, setVideoState ] = useState();
    const [ player, setPlayer ] = useState();
    const [ videoSrc, setVideoSrc ] = useState();
    const [ started, setStarted ] = useState(false);
    
    const roomData = props.roomData

    // Is socket the owner of this room.
    useEffect(() => {
        if(!isBroadcaster) { 
            const roomBroadcaster = roomData.broadcaster

            if(roomBroadcaster?.socketId === socketSubscriber.getSocket()?.id) {
                setIsBroadcaster(true)
            }        
        }
    } , [roomData.broadcaster])

    // Set the react video player src when this component mounts.
    useEffect(() => {
        setVideoSrc(roomData.video_src)
    }, [])

    useEffect(() => {
        socketSubscriber.on(ROOM_OWNER_VIDEO_STATE_CHANGED, (data) => {
            setOwnerVideoState(data.state); 
            const _ownerState = data.state;

            if (!isBroadcaster && videoState) {
                if(Math.abs((_ownerState.currentTime - videoState.currentTime)) > 2) { // Duration Change
                    videoState.paused === false && player.seek(_ownerState.currentTime);
                }

                // Pause if the owner is paused
                _ownerState.paused && player.pause();

                // Player if the owner is not paused
                !_ownerState.paused && player.play();
            }
        });

        socketSubscriber.on(ROOM_VIDEO_URL_CHANGED, (data) => {
            setVideoSrc(data.url);
        });

        socketSubscriber.on(ROOM_VIDEO_ERROR, (data) => {
            console.log("ROOM_VIDEO_ERROR: " +  data.message);
        });

        // For people joining in after it has started, play to where the owner is at
        if (videoState && videoState.hasStarted && !started) {
            if (!isBroadcaster) {
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
    }, [videoState]);

    function VideoResumed() {
        ownerVideoState && player.seek(ownerVideoState.currentTime);
        ownerVideoState && ownerVideoState.paused && player.pause();
    }

    function videoStateChanged(state, prevState, player) {
        setVideoState(state);
        setPlayer(player);

        // Disable functionality for users who aren't the owner.
        if(isBroadcaster !== null && !isBroadcaster) {
            if (state.paused === false && prevState.paused === true) {
                VideoResumed();
            }
        }

        if (isBroadcaster) {
            socketSubscriber.emit("RoomVideoStateChange", { roomCode: roomData.roomCode , state });
        }
    }

    return (
        <div className="room__videoArea">
            <VideoPlayer 
                className="room__video"
                src={videoSrc} 
                hideDefaultControls={!isBroadcaster}  
                fluid={false} 
                handleStateChange={videoStateChanged}
                autoPlay={true}
            />
        </div>
    )
}