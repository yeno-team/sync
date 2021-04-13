import React from 'react';
import { Link } from 'react-router-dom';


export default function Footer(props) {
    return (
        <footer>
            <div class="footer-cols">
                <div class="footer-col">
                    <h1 class="col-title">Site Links</h1>
                    <ul>
                        <li><a target="_blank" href="https://github.com/yeno-team/sync/blob/main/docs/supported-sites.md">Supported sites list</a></li>
                        <li><Link to="/rooms">Rooms page</Link></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h1 class="col-title">Legal</h1>
                    <ul>
                        <li><Link to="/private-policy">Privacy Policy</Link></li>
                        <li><Link to="/tos">Terms of Use</Link></li>
                    </ul>
                </div>
            </div>
            <p>Copyright &copy; 2021 Sync. All rights reserved.</p>
        </footer>
    )
}