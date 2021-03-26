import React from 'react';
import HeroSection from './HeroSection';
import Sections from './Sections';
import Footer from './Footer';
import "./index.css";

export function HomeLayout(props) {
    return (
        <React.Fragment>
            <HeroSection/>
            <Sections/>
            <Footer/>
        </React.Fragment>
    )
}