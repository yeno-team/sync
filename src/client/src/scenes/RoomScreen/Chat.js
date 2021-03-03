import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat, usePrevious } from "../../hooks/";

import './Chat.css';

export const Chat = (props) => {
    const { code } = useParams();

    const [messageText, setMessageText] = useState("");
    const {messages, sendMessage, errors} = useChat(code);

    const prevErrors = usePrevious(errors);
    const prevMessages = usePrevious(messages);

    const handleChange = (e) => {
        setMessageText(e.target.value)
    }

    const messageElements = messages.map((message , index) => <div key={index}>{message}</div>);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(messageText);
        setMessageText("");
    }


    useEffect(() => {
        const newErrors = errors.filter((error, index) => prevErrors[index] !== error);
        const newMessages = messages.filter((message, index) => prevMessages[index] !== message);

        if (newErrors.length > 0) {
            newErrors.forEach((v) => console.log("ERROR: " + v));
        }

        if (newMessages.length > 0) {
            const chat = document.getElementById("room__chat");
            chat.scrollTop = chat.scrollHeight;
        }
    
    }, [errors, messages]);

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