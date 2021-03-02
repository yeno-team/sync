import React , { useState, useEffect } from 'react'
import { useHistory , useParams } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { RoomView } from './RoomView';
import { getRoomData } from '../../api/room/roomService';
import { useRoomAuth, usePrevious } from '../../hooks';


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

    const newUsers = users.filter(user => prevUsers.indexOf(user) === -1);
    const newErrors = errors.filter(error => prevErrors.indexOf(error) === -1);
    
    if (newUsers.length > 0) {
        console.log("A new user is here!");

        // This case of authorization is true because the first ever user joined will always be the client's socket
        if (!authorized) {
            setAuthorized(true);
        }
    }

    if (newErrors.length > 0) {
        if(newErrors.indexOf("Incorrect Room Password") != -1) {
            setAuthorized(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const roomData = await getRoomData(code);

                setRoomExists(true);
                setRoomData(roomData);

                if (roomData.is_private == false) {
                    joinRoom("khai93", "");
                }
            } catch (e) {
                setRoomExists(false);
                console.error(e);
            }
        })();
    }, []);

        
    const submitPassword = (e) => {
        joinRoom("khai983", roomPassword);
    }

    if (roomExists != null && roomExists == false) {
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
            ) : <RoomView />
        }
     </React.Fragment>
    )
} //danny was here lunatite was here 