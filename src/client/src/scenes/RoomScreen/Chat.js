import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat, usePrevious } from "../../hooks/";

import './Chat.css';

export const Chat = (props) => {
    const { code } = useParams();

    const [messageText, setMessageText] = useState("");
    const {messages, sendMessage, errors} = useChat(code);

    const prevErrors = usePrevious(errors);

    const handleChange = (e) => {
        setMessageText(e.target.value)
    }

    const newErrors = errors.filter(error => prevErrors.indexOf(error) === -1);
    
    if (newErrors.length > 0) {
        newErrors.forEach((v) => console.log("ERROR: " + v));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(messageText);
        setMessageText("");
    }

    const messageElements = messages.map((message , index) => <div key={index}>{message}</div>);
    
    return (
        <div>
            <div id="room__chat" className="room__chat">
                <div>Username: Message</div>
                {
                    messageElements 
                }
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Send a message..." value={messageText} onChange={handleChange}/>
                <input type="submit" value="Send" />
            </form>
        </div>
    )
}