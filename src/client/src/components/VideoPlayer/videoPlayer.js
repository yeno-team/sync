import React from 'react'

import { Player } from 'video-react';

export const VideoPlayer = (props) => {

    return (
        <Player
            { ...props }
        />
    )
}