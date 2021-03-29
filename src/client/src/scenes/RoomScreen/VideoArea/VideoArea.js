import React, {useState, useEffect} from 'react';
import socketSubscriber from '../../../api/socket/socketSubscriber';
import VideoPlayer from '../../../components/VideoPlayer';
import { useWindowDimensions } from '../../../hooks';

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
    const { height, width } = useWindowDimensions();

    const roomData = props.roomData;
    const clientIsOwner = roomData.users.some((user) => socketSubscriber.getSocket().id === user.socket_id && user.rank === 0);

    useEffect(() => {
        if (roomData) {
            if (videoSrc === null) {
                setVideoSrc(roomData.video_src || "");
            }
        }

        socketSubscriber.on(ROOM_OWNER_VIDEO_STATE_CHANGED, (data) => {
            setOwnerVideoState(data.state); 

            const _ownerState = data.state;

            if (!clientIsOwner && videoState) {
                if(Math.abs((_ownerState.currentTime - videoState.currentTime)) > 2) { // Duration Change
                    videoState.paused === false && player.seek(_ownerState.currentTime);
                }

                if(_ownerState.muted !== videoState.muted) { // Mute Change
                    player.muted = data.state.muted;
                }

                if(_ownerState.volume !== videoState.volume) { // Volume Change
                    player.volume = data.state.volume;
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
            if (!clientIsOwner) {
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
    }, [props.roomData, videoState]);

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
        if(clientIsOwner !== null && !clientIsOwner) {
            if (state.paused === false && prevState.paused === true) {
                VideoResumed();
            }

            if(state.muted !== prevState.muted) {
                VideoMuted();
            }
        }

        if (clientIsOwner) {
            socketSubscriber.emit("RoomVideoStateChange", { roomCode: props.roomData.code, state });
        }
    }

    return (
        <div className="room__videoArea">
            <VideoPlayer 
                className="room__video"
                src={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} 
                hideControls={!clientIsOwner}  
                fluid={false} 
                handleStateChange={videoStateChanged}
            />
        </div>
    )
}