import React from 'react'
import "./index.css"

const Button = (props) => {
    return (
        <button className={`btn ${props.className ? props.className : ""}`}>{props.text}</button>
    )
}

export default Button;