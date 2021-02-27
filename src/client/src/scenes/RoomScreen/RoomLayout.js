import React from 'react';
import OwnerPanel from './OwnerPanel';
import VideoPlayer from '../../components/VideoPlayer/videoPlayer';

export const RoomLayout = (props) => {
    function emitDurationChangeEvent() {
        // call duration change socket event
    }

    return (
        <div>
            <OwnerPanel/>
            <VideoPlayer src="http://media.w3.org/2010/05/video/movie_300.webm" fluid={false} manualDurationChangeHandler={emitDurationChangeEvent}/>
        </div>
    )
}