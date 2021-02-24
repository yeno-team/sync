import React , { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Col , Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function JoinRoomForm(props){
    const [formVals , setFormVals] = useState({
        roomName : "",
        userLimit : "5",
        roomPassword : "",
        isPrivate : false
    })

    const submitForm = (e) => {
        e.preventDefault()

        props.onHide()
        // Redirect the user to the room page.
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
                        <Form.Group as={Col} controlId="createRoom.roomName">
                                <Form.Label>Room Name</Form.Label>
                                <Form.Control type="text" placeholder="Anime Room" name="roomName" onChange={handleInputChange} value={formVals.roomName} required></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} controlId="createRoom.userLimit">
                            <Form.Label>Max Users</Form.Label>
                            <Form.Control as="select" onChange={handleInputChange} value={formVals.userLimit} name="userLimit">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group controlId="createRoom.roomPassword">
                        <Form.Label>Room Password <b>(Optional)</b></Form.Label>
                        <Form.Control type="password" onChange={handleInputChange} name="roomPassword" value={formVals.roomPassword}></Form.Control> 
                    </Form.Group> 
                    <Form.Check type="switch" id="isPrivate" label="Private Room" title="Set Private Room" checked={setFormVals.isPrivate} onChange={handleInputChange} name="isPrivate"/>
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