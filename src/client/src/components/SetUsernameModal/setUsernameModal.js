import React, { useState } from 'react';

import "./usernameModal.css";

export const SetUsernameModal = (props) => {
    const [username, setUsername] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setUsername(e.target.value);
    }

    const handleSubmit = () => {
        if (submitted === false) {
            setSubmitted(true);
        }
    }

    return (
        <React.Fragment>
            {
                submitted ? 
                <props.nextComponent username={username} /> :
                <div className="usernameModal__main">
                    <div>
                        <h3>Enter your Username</h3>
                        <input type="text" placeholder="Username.." value={username} onChange={handleChange}/>
                        <button onClick={handleSubmit}>Set</button>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}