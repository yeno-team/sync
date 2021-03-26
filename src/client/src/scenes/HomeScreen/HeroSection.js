import React from 'react';
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
                    
                </div>
            </main>
            <div className="hero-graphic">
                <img src={RoomGrahpics} alt="Room Graphic"/>
            </div>
        </div>
    )
}