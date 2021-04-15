import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat, usePrevious, useEmotes } from "../../hooks";
import { colorShade, stringToColor } from "../../utils/color";
import { useAlert } from 'react-alert'

import "./chat.css";

import OwnerTag from "../../assets/icons/owner-tag.svg";
import BotTag from '../../assets/icons/bot-tag.svg';

export const Chat = (props) => {
    const { code } = useParams();
    const [messageText, setMessageText] = useState("");
    const alert = useAlert();
    const {messages, sendMessage, errors} = useChat(code);
    const {emotes, getEmote} = useEmotes();
    const prevErrors = usePrevious(errors);
    const prevMessages = usePrevious(messages);
   

    const headerElements = props.headerElements || [(<h4 className="chat__defaultTitle" key="0">Chat</h4>)]
    const formElements = props.formElements;
    
    useEffect(() => {
        const newErrors = errors.filter((error, index) => prevErrors[index] !== error);
        const newMessages = messages.filter((message, index) => prevMessages[index] !== message);

        if (newErrors.length > 0) {
            newErrors.forEach((v) => alert.show(v));
        }

        if (newMessages.length > 0) {
            const chat = document.getElementById("chat__messages");
            chat.scrollTop = chat.scrollHeight;
        }
    
    }, [errors, messages]);


    const handleChange = (e) => {
        setMessageText(e.target.value);
    }

    const isWordAEmote = (word) => {
        const emotesFiltered = emotes.filter(emote => emote.code === word);
    
        return emotesFiltered && emotesFiltered.length > 0;
    }

    const messageElements = messages.map((message , index) => {
        let processedMessage = [];

        if (message.text == null) {
            return console.error("Text was null!");
        }

        if (typeof message.text == 'object') {
            message.text = "Unexpected error occured!"
        }

    

        const words = message.text
            .replace(/\n/g, " <br> ")
            .replace(/\*\*/g, " <b> ")
            .replace(/[()]/g, " <a> ")
            .split(" ");

        /**
         * If user is owner, add tag next to name
         */
        const ownerTagElement = message.sender.rank === 0 ? <img src={OwnerTag} className="chat__tag" /> : null;

        /**
         * If user is owner, add tag next to name
         */
         const botTagElement = message.sender.rank === 2 ? <img src={BotTag} className="chat__tag" /> : null;


        const emotesFiltered = words.filter(isWordAEmote);

        let last;
        let lastBoldIndex;
        let lastLinkIndex;

        words.map((val, index) => {
            // turn line breaks in to actual br elements
            if (val === "<br>") {
                processedMessage.push(words.slice(last+1, index).join(" "));
                processedMessage.push(<br />);

                last = index;
                return;
            }

            // turn everything covered in ** to bold
            if (val === "<b>") {
                if (lastBoldIndex) {
                     
                    processedMessage.push(<b>{ words.slice(lastBoldIndex+1, index).join(" ")}</b>);
                    lastBoldIndex = null;
                    lastLinkIndex = null;
                } else {
                    const leftOver = words.slice(last+1, last+2)[0] ;

                    if (leftOver && leftOver !== ',') {
                        processedMessage.push(leftOver + " ");
                    }
                    
                    processedMessage.push(words.slice(last+2, index).join(" "));
                    lastBoldIndex = index;
                }

                last = index;
                return;
            }

            // turn everything covered in & to a link
            if (val === "<a>") {
                if (lastLinkIndex) {
                    const link = words.slice(lastLinkIndex+1, index);

                    processedMessage.push(<a className="chat__messageLink" target="_blank" href={link}>{ link.join(" ") + " "}</a>);
                    lastLinkIndex = null;
                    lastBoldIndex = null;
                } else {
                    const leftOver = words.slice(last+1, last+2)[0] ;

                    if (leftOver && leftOver !== ',') {
                        processedMessage.push(leftOver + " ");
                    }
                    
                    processedMessage.push(words.slice(last+2, index).join(" "));
                    lastLinkIndex = index;
                }

                last = index;
                return;
            }

            if (emotesFiltered.indexOf(val) !== -1) {
                processedMessage.push(words.slice(last+1, index).join(" "));
                processedMessage.push(<img className="chat__emote" src={getEmote(val).url}></img>)
                last = index;
                return;
            }

            if (index === words.length-1) {
                processedMessage.push(words.slice(last != null ? last + 1 : 0, index+1).join(" "));
            }
        });


        const shadeAmount = 150;

        return (
            <div className="chat__message" key={index}>
                {ownerTagElement}
                {botTagElement}
                <span style={{fontWeight: "bold", color: colorShade(stringToColor(message.sender.socket_id), shadeAmount)}} className="chat__messageUsername">{ message.sender.username + ": " }</span>
                <span className="chat__messageText">{ processedMessage }</span>
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
                <div id="chat__messages" className="chat__messages">
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