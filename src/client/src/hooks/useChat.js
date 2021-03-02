
import { useEffect, useRef, useState } from "react";

import socketSubscriber from '../api/socket/socketSubscriber';

const NEW_CHAT_MESSAGE_EVENT = "RoomChatNewMessage";
const SEND_CHAT_MESSAGE_EVENT = "ChatSendMessage";
const ERROR_EVENT = "RoomChatError";

export default (roomCode) => {
    const [messages, setMessages] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        socketSubscriber.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
            setMessages((messages) => [...messages, data.sender.username + ": " + data.message])
        });

        socketSubscriber.on(ERROR_EVENT, (data) => {
            setErrors((errors) => [...errors, data.message]);
        });

        return () => {
            socketSubscriber.off(NEW_CHAT_MESSAGE_EVENT);
            socketSubscriber.off(ERROR_EVENT);
        }
    }, [roomCode, messages, errors]);

    const sendMessage = (message) => {
        socketSubscriber.emit(SEND_CHAT_MESSAGE_EVENT, {
            roomCode,
            message
        });
    }

    return { messages, sendMessage, errors };
}