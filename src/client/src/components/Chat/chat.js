import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat, usePrevious, useEmotes } from "../../hooks";
import { colorShade, stringToColor } from "../../utils/color";

import "./chat.css";

import OwnerTag from "../../assets/icons/owner-tag.svg";

export const Chat = (props) => {
    const { code } = useParams();
    const [messageText, setMessageText] = useState("");
    const {messages, sendMessage, errors} = useChat(code);
    const {emotes, getEmote} = useEmotes();
    const prevErrors = usePrevious(errors);
    const prevMessages = usePrevious(messages);

    const headerElements = props.headerElements || [(<h4 className="chat__defaultTitle">Chat</h4>)]
    const formElements = props.formElements;
    
    useEffect(() => {
        const newErrors = errors.filter((error, index) => prevErrors[index] !== error);
        const newMessages = messages.filter((message, index) => prevMessages[index] !== message);

        if (newErrors.length > 0) {
            newErrors.forEach((v) => console.log("ERROR: " + v));
        }

        if (newMessages.length > 0) {
            const chat = document.getElementById("chat__main");
            chat.scrollTop = chat.scrollHeight;
        }
    
    }, [errors, messages]);


    const handleChange = (e) => {
        setMessageText(e.target.value)
    }

    const isWordAEmote = (word) => {
        const emotesFiltered = emotes.filter(emote => emote.code === word);
    
        return emotesFiltered && emotesFiltered.length > 0;
    }

    const messageElements = messages.map((message , index) => {
        let processedMessage = [];
        const words = message.text.split(" ");

        /**
         * If user is owner, add tag next to name
         */
        const ownerTagElement = message.sender.rank === 0 ? <img src={OwnerTag} className="chat__tag" /> : null;

        const emotesFiltered = words.filter(isWordAEmote);

        let lastEmote = 0;

        words.map((val, index) => {
            if (emotesFiltered.indexOf(val) !== -1) {
                processedMessage.push(words.slice(lastEmote, index).join(" "));
                processedMessage.push(<img className="chat__emote" src={getEmote(val).url}></img>)
                lastEmote = index;
                return;
            }

            if (index === words.length-1) {
                processedMessage.push(words.slice(lastEmote, index+1).join(" "));
            }
        });


        return (
            <div className="chat__message" key={index}>
                {ownerTagElement}
                <span style={{fontWeight: "bold", color: colorShade(stringToColor(message.sender.socket_id), 50)}}>{ message.sender.username + ": " }</span>
                <span>{ processedMessage }</span>
            </div>
        )
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(messageText);
        setMessageText("");
    }


    return (
        <div className={props.className + " chat__ctn"}>
            <div id="chat__main" className="chat__main">
                <div className="chat__header">{ headerElements }</div>
                <div className="chat__messages">
                    {
                        messageElements 
                    }
                </div>
                <div className="chat__formCtn">
                    <form className="chat__form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Send a message..." value={messageText} onChange={handleChange}/>
                        { formElements }
                    </form>
                </div>
                
            </div>
                
            
        </div>
    )
}