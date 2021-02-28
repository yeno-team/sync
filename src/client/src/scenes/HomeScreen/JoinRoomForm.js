import React , { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Col , Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';

function JoinRoomForm(props){
    const history = useHistory()

    const [formVals , setFormVals] = useState({
        name : "",
        description : "",
        max_users : "5",
        room_password : "",
        is_private : false
    })

    const submitForm = async (e) => {
        e.preventDefault()

        try{
            const req = await Axios({
                url : "http://localhost:8080/api/room/create",
                method : "POST",
                data : {
                    ...formVals
                }
            })

            const { code } = req.data

            history.push(`/room/${code}`)
        } catch (e) {
            console.log(e)
        }
    }

    const handleInputChange = (event) => {
        const target = event.target
        const name = target.name
        const value = target.type === "checkbox" ? target.checked : target.value
        
        setFormVals({
            ...formVals,
            [name] : value
        })
    }


    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Create Room</Modal.Title>     
            </Modal.Header>
            <Modal.Body> 
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="createRoom.name">
                                <Form.Label>Room Name</Form.Label>
                                <Form.Control type="text" placeholder="Anime Room" name="name" onChange={handleInputChange} value={formVals.name} required></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} controlId="createRoom.max_users">
                            <Form.Label>Max Users</Form.Label>
                            <Form.Control as="select" onChange={handleInputChange} value={formVals.max_users} name="max_users">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group controlId="createRoom.description">
                        <Form.Label> Description <b>(Optional)</b>  </Form.Label>
                        <Form.Control as="textarea" placeholder="Room Description..." name="description" onChange={handleInputChange} value={formVals.description}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="createRoom.room_password">
                        <Form.Label>Room Password <b>(Optional)</b></Form.Label>
                        <Form.Control type="password" onChange={handleInputChange} name="room_password" value={formVals.room_password}></Form.Control> 
                    </Form.Group> 
                    <Form.Check type="switch" id="is_private" label="Private Room" title="Set Private Room" checked={setFormVals.is_private} onChange={handleInputChange} name="isPrivate"/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={submitForm}>
                    Submit
                </Button>
                <Button variant="danger" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default JoinRoomForm