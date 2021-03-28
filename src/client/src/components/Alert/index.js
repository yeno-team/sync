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
    const [ alertShow , setAlertShow ] = useState(show)

    const alertClassNamesArr = [
        'alert',
        variants.includes(variant) ? `alert-${variant}` : `alert-dark-blue`
    ]

    const alertClassNamesStr = classNames(alertClassNamesArr)

    return (
        <React.Fragment>
            {(typeof(alertShow) === "undefined" || alertShow !== false) &&
            
            <div className="alert" className={`${alertClassNamesStr} ${className}`}>
                {children}
                {dismissable && <div className="exit" onClick={() => setAlertShow(false)}/>}
            </div>
            }
        </React.Fragment>
    )
}