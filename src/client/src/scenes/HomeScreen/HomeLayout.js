import React from 'react';
import HeroSection from './HeroSection';
import Sections from './Sections';
import { Navbar } from '../../components/Navbar'
import Footer from './Footer';
import "./index.css";

export function HomeLayout(props) {
    return (
        <React.Fragment>
            <Navbar />
            <HeroSection/>
            <Sections/>
            <Footer/>
        </React.Fragment>
    )
}