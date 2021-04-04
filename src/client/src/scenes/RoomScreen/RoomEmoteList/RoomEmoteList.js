import React from 'react';
import { useAlert } from 'react-alert'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import './RoomEmoteList.css';

export const RoomEmoteList = (props) => {
    const emotes = props.emotes;
    const active = props.active;

    const alert = useAlert();

    const emoteElements = emotes.map((emote) => <CopyToClipboard text={emote.code} onCopy={() => {alert.show(emote.code + " copied to clipboard.", {timeout: 800});}}>
        <div>
            <img src={emote.url}></img>
        </div>
    </CopyToClipboard>);

    return (
        <React.Fragment>
            {
                active &&
                <div className="RoomEmoteList">
                    {
                        emoteElements
                    }
                </div>
            }
        </React.Fragment>
        
    )
}
