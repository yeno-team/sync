import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../components/Button';
import YoutubeGraphicSVG from '../../assets/images/youtubeGraphics.svg';
import ChatGraphicsSVG from '../../assets/images/chatGraphics.svg';
import VideoClip from '../../assets/videos/xqC1.mp4';

export default function FeatureSections(props) {
    let history = useHistory();

    return (
        <div className="section-container">
            <section className="section-feature">
                <div className="section-content">
                    <h1 className="section-title">Share videos from our list of supported sites</h1>
                    <p className="section-body">Choose from a wide variety of sites to share videos from. Want a site supported? Send us a ticket!</p>
                </div>
                <div className="section-graphic">
                    <div className="video-clip-container">
                        <img src={YoutubeGraphicSVG} alt="Feature Graphic" className="videoGraphic"/>
                        <div className="video-clip"><video src={VideoClip} className="video" autoPlay loop muted></video></div>
                    </div>
                </div>
            </section>
            <section className="section-feature">
                <div className="section-graphic"><img src={ChatGraphicsSVG} alt="Chat Graphic"/></div>
                <div className="section-content">
                    <h1 className="section-title">Socialize with friends with our Twitch-based chat!</h1>
                    <p className="section-body">Chat with friends with our chat made to help you easily express your emotions with emotes from BTTV.</p>
                </div>
            </section>
            <section className="private-room">
                <h1 className="section-title">Create a free private room reserved just for you today!</h1>
                <Button animated animatedStyle="underline" variant="green" animatedColor="dark-blue" className="btn" onClick={() => history.push("/rooms" , { showModal : true } )}>Get Started</Button>
            </section>
        </div>
    )
}