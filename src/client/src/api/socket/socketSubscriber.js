import config from '../../config';
import { io } from 'socket.io-client';

let socket;

export default {
    listeners: [],
    init() {
        socket = io(config.socket.endpoint);
    },
    on(eventName, callback) {
        socket.on(eventName, callback);
    },
    emit(eventName, data) {
        socket.emit(eventName, data)
    }
}
