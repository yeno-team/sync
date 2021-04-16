import React, { useState } from 'react';
import { useAlert } from 'react-alert'

import './RoomEmoteList.css';

export const RoomEmoteList = (props) => {
    const emotes = props.emotes;
    const active = props.active;
    const setActive = props.setActive;
    const chatInputValue = props.chatInputvalue;
    const setChatInputValue = props.setChatInputValue;

    const [shiftKeyIsDown, setShiftKeyIsDown] = useState(false);

    const alert = useAlert();

    const handleEmoteClick = (emote) => {
        !shiftKeyIsDown && setActive && setActive(false);
        
        if (setChatInputValue) {
            const inputEle = document.getElementById("chat__input");

            if (inputEle) {
                inputEle.focus();
            }

            setChatInputValue((chatInputValue || "") + " " + emote.code);
        }
    }

    const emoteElements = emotes.map((emote) => 
        <div onClick={() => handleEmoteClick(emote)}>
            <img className="noselect" src={emote.url}></img>
            <p className="noselect">{emote.code}</p>
        </div>
    );

    const onKeyDown = (e) => {
        if(e.keyCode == 16) {
            setShiftKeyIsDown(true);
        }
    }

    const onKeyUp = (e) => {
        if(e.keyCode == 16) {
            setShiftKeyIsDown(false);
        }
    }

    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;

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
