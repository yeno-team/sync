import React , { useState } from 'react';
import classNames from 'classnames';
import variants from '../variants';
import './index.css';

export default function Alert({
    variant,
    onClick,
    dismissable,
    className,
    children,
    show
}) {
    const [ alertShow , setAlertShow ] = useState(show || true) // If show is a falsy value it will default to true.

    const alertClassNamesArr = [
        'alert',
        variants.includes(variant) ? `alert-${variant}` : `alert-dark-blue`
    ]

    const alertClassNamesStr = classNames(alertClassNamesArr)

    if(alertShow === false) {
        return null;
    }

    function dismissableButton() {
        setAlertShow(false)

        if(typeof onClick === "function") { // If onClick is a function execute the function.
            onClick()
        }
    }

    return (
        <div className={`${alertClassNamesStr} ${className}`}>
            {children}
            {dismissable && <div className="exit" onClick={dismissableButton}/>}
        </div>
    )
}