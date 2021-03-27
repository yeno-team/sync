import React from 'react';
import Button from '../../components/Button'
import RoomGrahpics from '../../assets/images/roomGraphics.svg';

export default function HeroSection(props) {
    return (
        <div className="hero-container">
            <main className="hero-content">
                <h1 className="hero-title">
                    Innovating how we watch videos with friends online.
                </h1>
                <p className="hero-body">
                    Sync with others as you watch videos from multiple sources from around the internet using a chat.
                </p>
                <div className="button-group">
                    <Button animated animatedStyle="underline" variant="green" animatedColor="white" className="btn">Learn more!</Button>
                    <Button animated animatedStyle="filled" variant="white" className="btn-ctn">Public Rooms</Button>
                </div>
            </main>
            <div className="hero-graphic">
                <img src={RoomGrahpics} alt="Room Graphic"/>
            </div>
        </div>
    )
}