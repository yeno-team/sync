import React, {useParams} from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import { Chat } from './Chat';

export const RoomView = (props) => {
    return (
        <React.Fragment>
            <VideoPlayer src="http://media.w3.org/2010/05/bunny/movie.mp4" fluid={false}/>
            <Chat />
        </React.Fragment>
    )
}