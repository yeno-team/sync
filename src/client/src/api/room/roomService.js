import Axios from 'axios';
import config from '../../config';


export const getRoomData = async (roomCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = await Axios({
                url : config.api.endpoint + `/api/room/${roomCode}`,
                method : "GET"
            });

            return resolve(req.data);
        } catch (e) {
            return reject(e);
        }
    });
};

export const getRoomList = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = await Axios({
                url: config.api.endpoint + `/api/room/list`,
                method: 'GET'
            });

            return resolve (req.data);
        } catch (e) {
            return reject(e);
        }
    })
}

export const createRoom = (roomData) => {
    return new Promise(async (resolve , reject) => {
        try {
            const req = await Axios({
                url : config.api.endpoint + "/api/room/create",
                method : "POST",
                data : {
                    ...roomData
                }
            })

            return resolve(req.data)
        } catch (e) {
            return reject(e)
        }
    })
}