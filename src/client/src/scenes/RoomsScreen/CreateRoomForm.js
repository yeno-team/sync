import React , { useState } from 'react';
import { useHistory } from 'react-router-dom';
import socketSubscriber from '../../api/socket/socketSubscriber'
import { createRoom } from '../../api/room/roomService';
import Modal , { ModalHeader , ModalBody } from '../../components/Modal'
import Button from '../../components/Button';
import { FormCol , FormRow , FormGroup , FormControl, FormLabel , FormSwitch} from '../../components/Form'

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
            const req = await createRoom(formVals)

            const { code , is_private } = req;

            if(!is_private) { 
                socketSubscriber.emit("RoomCreated" , { roomCode : code })
            }

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
        <Modal onHide={props.onHide} show={props.show}>
            <ModalHeader closeButton>
                Create Your Room
            </ModalHeader>
            <ModalBody>
                <form id="create-room-form" onSubmit={submitForm}>
                    <FormRow>
                        <FormCol>
                            <FormLabel controlId="name" formId="create-room-form">Room Name : </FormLabel>
                            <FormControl type="text" onChange={handleInputChange} id="name" name="name" maxLength="30"/>
                        </FormCol>
                        <FormCol>
                            <FormLabel controlId="max_users" formId="create-room-form">Max Users : </FormLabel>
                            <FormControl type="select" value={formVals.max_users} onChange={handleInputChange} id="max_users" name="max_users">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </FormControl>
                        </FormCol>
                    </FormRow>
                    <FormGroup>
                        <FormLabel controlId="description" formId="create-room-form">Description : </FormLabel>
                        <FormControl onChange={handleInputChange} id="description" name="description" maxLength="75" type="textarea"/>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel style={{ display : "inline-block" , marginRight : "5px"}}>Private Room: </FormLabel>
                        <FormSwitch onChange={handleInputChange} name="is_private" id="is_private"/>
                    </FormGroup>
                    {
                        formVals.is_private &&
                        <FormGroup>
                            <FormLabel controlId="password" formId="create-room-form">Room Password : </FormLabel>
                            <FormControl onChange={handleInputChange} name="room_password" id="room_password" type="password"/>
                        </FormGroup>
                    }
                    <Button variant="green">Submit</Button>
                </form> 
            </ModalBody>
        </Modal>
    )
}

export default JoinRoomForm