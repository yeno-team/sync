import React, {useState, useEffect} from 'react';
import socketSubscriber from '../../api/socket/socketSubscriber';
import VideoPlayer from '../../components/VideoPlayer/';
import { useWindowDimensions } from '../../hooks';

const ROOM_SETTING_UPDATED_EVENT = "RoomSetttingUpdated";
const ROOM_OWNER_VIDEO_STATE_CHANGED = "RoomOwnerVideoStateChanged";
const ROOM_VIDEO_ERROR = "RoomVideoError";
const ROOM_VIDEO_URL_CHANGED = "RoomVideoUrlChanged";

export const VideoArea = (props) => {
    const [ ownerVideoState, setOwnerVideoState ] = useState({});
    const [ videoState, setVideoState ] = useState();
    const [ player, setPlayer ] = useState();
    const [ videoSrc, setVideoSrc ] = useState();
    const [ started, setStarted ] = useState(false);
    const [ owner, setOwner ] = useState(); 
    const { height, width } = useWindowDimensions();

    const roomData = props.roomData;

    if (roomData) {
        if (videoSrc == null) {
            setVideoSrc(roomData.video_src);
        }

        if (roomData.users.length > 0) {
            setOwner(roomData.users.some((user) => socketSubscriber.getSocket().id === user.socket_id && user.rank === 0));
        }
    }


    useEffect(() => {
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

                // Pause if the owner is paused
                data.state.paused && player.pause();

                // Player if the owner is not paused
                !data.state.paused && player.play();
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
    }, [owner]);

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
        <div className="room__videoArea">
            <VideoPlayer 
                width={width} 
                height={height} 
                src={videoSrc} 
                hideControls={owner !== null && !owner}  
                fluid={false} 
                handleStateChange={videoStateChanged}
            />
        </div>
    )
}