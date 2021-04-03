import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat, usePrevious, useEmotes } from "../../hooks/";

import './Chat.css';

export const Chat = (props) => {
    const { code } = useParams();

    const [messageText, setMessageText] = useState("");
    const {messages, sendMessage, errors} = useChat(code);
    const {emotes} = useEmotes();

    const prevErrors = usePrevious(errors);
    const prevMessages = usePrevious(messages);

    const handleChange = (e) => {
        setMessageText(e.target.value)
    }

    const getEmoteFromCode = (code) => {
        const emote = emotes.filter(emote => emote.code === code);

        return emote && emote[0];
    }

    const isWordAEmote = (word) => {
        const emotesFiltered = emotes.filter(emote => emote.code === word);

        return emotesFiltered && emotesFiltered.length > 0;
    }

    const messageElements = messages.map((message , index) => {
        let processedMessage = [];
        const words = message.split(" ");

        processedMessage.push(<strong>{words[0]}</strong>)

        words[0] = null;
        const emotesFiltered = words.filter(isWordAEmote);

        let lastEmote = 0;


        words.forEach((val, index) => {
            if (emotesFiltered.indexOf(val) !== -1) {
                processedMessage.push(words.slice(lastEmote, index).join(" "));
                processedMessage.push(<img className="room__image" alt="emoji" src={getEmoteFromCode(val).url}></img>)
                lastEmote = index;
            }

            if (index === words.length-1) {
                processedMessage.push(words.slice(lastEmote+1, index+1).join(" "));
            }
        });


        return (<div key={index}>{ processedMessage }</div>)
    });
    
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