import React from 'react';
import { Link } from 'react-router-dom'
import './index.css'

export function Navbar () {
    return (
        <header>
            <div class="logo"><img src="#" alt="Sync Logo"/></div>
            <nav class="navigation">
                <ul>
                    <li><Link to="/" className="navigation-link">Features</Link></li>
                    <li><Link to="/" className="navigation-link">Browse</Link></li>
                </ul>
            </nav>
        </header>
    )
}
