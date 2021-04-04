import config from '../../config';
import { io } from 'socket.io-client';

let socket;


const socketSubscriber = {
    listeners : [],
    init() {
        socket = io(config.socket.endpoint);
    },
    on(eventName, callback) {
        socket.on(eventName, callback);
    },
    off(eventName) {
        socket.off(eventName);
    },
    emit(eventName, data) {
        socket.emit(eventName, data)
    },
    getSocket() {
        return socket;
    }
}

export default socketSubscriber;