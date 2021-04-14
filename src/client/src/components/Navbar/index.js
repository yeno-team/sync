import React from 'react';
import { Link } from 'react-router-dom'
import Button from '../Button';
import './index.css'

import logo from '../../assets/icons/logo.svg';

export function Navbar () {
    return (
        <header className="navbar__ctn">
            <div className="logo"><Link to="/" ><img src={logo} alt="Sync Logo"/></Link></div>
            <nav className="navigation">
                <ul>
                    <li><Link to="/" className="navigation-link">Features</Link></li>
                    <li><Link to="/rooms" className="navigation-link"><Button variant="green">Browse</Button></Link></li>
                </ul>
            </nav>
        </header>
    )
}
