import React , { useState , useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import CreateRoomForm from './CreateRoomForm';
import Alert from '../../components/Alert';
import Rooms from './Rooms';
import { getRoomList } from '../../api/room/roomService';
import socketSubscriber from '../../api/socket/socketSubscriber';
import './index.css'
import "video-react/dist/video-react.css";

const NEW_ROOM_CREATED_EVENT = "NewRoomCreated";

export const RoomMenu = (props) => {
    const [ search , setSearch ] = useState("")
    const [ rooms , setRooms ] = useState([])
    const [ filteredRooms , setFilteredRooms ] = useState([])
    const [ isError , setIsError ] = useState(false)
    const history = useHistory();
    const [ modalShow , setModalShow ] = useState(false)

    useEffect(() => {
        /*
            Set the modalShow state to true if there was an showModal
            property in the state when redirected to this page.
        */

        const location = history.location
        const state = location.state

        if(state && state.hasOwnProperty("showModal") && state.showModal) {
            setModalShow(true)
        }
    } , [])
    
    useEffect(() => {
        (async () => {
            try {
                // Fetch current rooms
                const roomData = await getRoomList();
        
                setRooms(roomData)
                setFilteredRooms(roomData)
            } catch {
                setIsError(true)
            }
        })()
    } , [])
    
    useEffect(() => {
            socketSubscriber.on(NEW_ROOM_CREATED_EVENT , (data) => {
                setRooms((prevState) => [data , ...prevState])
            });
    
            return () => {
                socketSubscriber.off(NEW_ROOM_CREATED_EVENT)
            }
    } , [])
    

    useEffect(() => {
        const filteredRooms = rooms.filter(({ name , code }) => name.startsWith(search) || code.startsWith(search))
        setFilteredRooms(filteredRooms)
    } , [search])

    return (
        <main className="roomContainer">
            { isError && <Alert variant="red" dismissable>
                There was a problem fetching the avaliable rooms. Please try again by refreshing the page or contact us if this problem still persists.
            </Alert> }
            
            <CreateRoomForm onHide={() => setModalShow(false)} show={modalShow}/>
    
            <section className="room-options">
                <button id="create-room-button" onClick={() => setModalShow(true)}>Create A Room</button>
                <p id="or">OR</p>
                <input type="text" name="search-room" id="search-input" placeholder="Search for rooms with text or room code..." onChange={(e) => setSearch(e.target.value)} value={search}/>
             </section>
            {
                !isError &&
                <section className="rooms">
                    <Rooms rooms={filteredRooms}/>
                </section>
            }
        </main>
    )
}