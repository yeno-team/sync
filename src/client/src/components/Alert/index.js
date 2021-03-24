import React , { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

export default function AlertContainer(props) {
    const [ show , setShow ] = useState(props.show || true)

    return (
        <Alert dismissible={props.dismissible || false} variant={props.variant} show={show} onClose={() => setShow(false)}>
            {props.text}
        </Alert>
    )
}