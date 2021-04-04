import React, { useState } from 'react';

import "./inputScreen.css";

/**
 * A full screen input screen that asks for input,
 * After setting the value, it loads in the nextComponent provided in props and passes down input and props.
 * 
 * props: {
 *   nextComponent: ReactComponent
 * }
 * 
 * @param {object} props 
 * @returns 
 */
export const InputScreen = (props) => {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const NextComponent = props.nextComponent;
    const InputName = props.inputName;

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleSubmit = () => {
        if (submitted === false) {
            setSubmitted(true);
        }
    }

    const keyDownHandler = (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <React.Fragment>
            {
                submitted ? 
                <NextComponent {...{[InputName]: value}} {...props} /> :
                <div className="inputScreen__main">
                    <div>
                        <h3>Enter your {`${InputName.charAt(0).toUpperCase() + InputName.slice(1)}`}</h3>
                        <input type="text" placeholder={`${InputName.charAt(0).toUpperCase() + InputName.slice(1)}`} value={value} onChange={handleChange} onKeyDown={keyDownHandler}/>
                        <button onClick={handleSubmit}>Set</button>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}