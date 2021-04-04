import React , { useState } from 'react';
import { useHistory } from 'react-router-dom';
import socketSubscriber from '../../api/socket/socketSubscriber'
import { createRoom } from '../../api/room/roomService';
import Modal from '../../components/Modal'
import Button from '../../components/Button';
import { FormCol , FormRow , FormGroup , FormControl, FormLabel , FormSwitch , FormControlErrorText } from '../../components/Form'

function JoinRoomForm(props){
    let nameInput = null;
    let descriptionInput = null;
    const history = useHistory();

    const [formVals , setFormVals] = useState({
        name : "",
        description : "",
        max_users : "5",
        room_password : "",
        is_private : false
    })

    const removeInputInvalid = (ele) => {
        if(ele) {
            ele.classList.contains("form-control-invalid") && ele.classList.remove("form-control-invalid")

            const errorElement = ele.parentNode.querySelector(".form-error-message")
            errorElement && (errorElement.style.display = "none")
        }
    }

    const addInputInvalid = (ele) => {
        if(ele) {
            !ele.classList.contains("form-control-invalid") && ele.classList.add("form-control-invalid")

            const errorElement = ele.parentNode.querySelector(".form-error-message")
            errorElement && (errorElement.style.display = "block")
        }
    }

    const validateForm = () => {
        let isValidateForm = true;

        if(nameInput) {
            if(formVals.name.length > 0) {
                removeInputInvalid(nameInput)
            } else {
                isValidateForm = false
                addInputInvalid(nameInput)
            }
        }

        if(descriptionInput) {
            if(formVals.description.length > 0) {
                removeInputInvalid(descriptionInput)
            } else {
                isValidateForm = false
                addInputInvalid(descriptionInput)
            }
        }

        return isValidateForm
    }

    const submitForm = async (e) => {
        e.preventDefault();

        if(!validateForm()) {
            return
        }


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
            <Modal.Header closeButton>
                Create Your Room
            </Modal.Header>
            <Modal.Body>
                <FormRow>
                    <FormCol>
                        <FormLabel htmlFor="name" form="create-room-form">Room Name : </FormLabel>
                        <FormControl type="text" onChange={handleInputChange} id="name" name="name" maxLength="40" inputRef={(ele) => (nameInput = ele)}/>
                        <FormControlErrorText>Required*</FormControlErrorText>
                    </FormCol>
                    <FormCol>
                        <FormLabel htmlFor="max_users" form="create-room-form">Max Users : </FormLabel>
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
                    <FormLabel htmlFor="description" form="create-room-form">Description : </FormLabel>
                    <FormControl onChange={handleInputChange} id="description" name="description" maxLength="75" type="textarea" inputRef={ele => (descriptionInput = ele)}/>
                    <FormControlErrorText>Required*</FormControlErrorText>
                </FormGroup>
                <FormGroup>
                    <FormLabel style={{ display : "inline-block" , marginRight : "5px"}} htmlFor={"is_private"} form ="create-room-form">Private Room: </FormLabel>
                    <FormSwitch onChange={handleInputChange} name="is_private" id="is_private"/>
                </FormGroup>
                {
                    formVals.is_private &&
                    <FormGroup>
                        <FormLabel htmlFor="password" form="create-room-form">Room Password : </FormLabel>
                        <FormControl onChange={handleInputChange} name="room_password" id="room_password" type="password"/>
                    </FormGroup>
                }
                <Button variant="green" onClick={submitForm}>Submit</Button>
            </Modal.Body>
        </Modal>
    )
}

export default JoinRoomForm