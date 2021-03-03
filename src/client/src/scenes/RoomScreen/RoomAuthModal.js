import React , { useState, useEffect } from 'react'
import { useHistory , useParams } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { RoomView } from './RoomView';
import { getRoomData } from '../../api/room/roomService';
import { useRoomAuth, usePrevious } from '../../hooks';
import socketSubscriber from '../../api/socket/socketSubscriber';

export const RoomAuthModal = (props) => { 
    const { code } = useParams();
    const history = useHistory();

    const { users, joinRoom, errors } = useRoomAuth(code);

    const prevUsers = usePrevious(users);
    const prevErrors = usePrevious(errors);

    const [ roomData, setRoomData ] = useState();
    const [ roomPassword , setRoomPassword ] = useState("");
    const [ roomExists, setRoomExists ] = useState();
    const [ authorized, setAuthorized ] = useState();
    const [ username, setUsername ] = useState();

  
    useEffect(() => {
        const newUsers = users.filter((user, index) => prevUsers[index] !== user);
        const newErrors = errors.filter((error, index) => prevErrors[index] !== error);
        if (newUsers.length > 0) {
            console.log("A new user is here!");
    
            // This case of authorization is true because the first ever user joined will always be the client's socket
            if (!authorized) {
                setAuthorized(true);
            }
        }
    
        if (newErrors.length > 0) {
            console.log(newErrors);
            if(newErrors.indexOf("Incorrect Room Password") !== -1 && !authorized) {
                setAuthorized(false);
            }
        }    
    }, [users, errors]);


    useEffect(() => {
        (async () => {
            try {
                const roomData = await getRoomData(code);

                setRoomExists(true);
                setRoomData(roomData);
                

                // console.log(roomData)

                if (roomData.is_private === false || roomData.users.length === 0) {
                    joinRoom(socketSubscriber.getSocket().id, "");
                }
            } catch (e) {
                setRoomExists(false);
                console.error(e);
            }
        })();
    } , []);

        
    const submitPassword = () => {
        joinRoom(socketSubscriber.getSocket().id, roomPassword);
    }

    if (roomExists !== null && roomExists === false) {
        return (
            <h1>Room doesn't exist</h1>
        )
    } else if (roomExists == null) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <React.Fragment>
        {
            roomData && roomData.is_private && !authorized ?
            (
                <Modal show={true} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Password Required!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="roomPassword">
                                <Form.Control type="password" placeholder="Password" required value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}/>

                            </Form.Group>           
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={submitPassword}>Submit</Button>
                        <Button variant="danger" onClick={() => history.push('/')}>Go back!</Button>
                    </Modal.Footer>
                </Modal>
            ) : <RoomView roomData={roomData} setRoomData={setRoomData}/>
        }
     </React.Fragment>
    )
} //danny was here lunatite was here 