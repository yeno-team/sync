import React from 'react';
import classNames from 'classnames';
import './index.css';

export const FormGroup = (props) => {
    const formGroupClassNames = classNames('form-group' , props.className)
    
    return (
        <div {...props} className={formGroupClassNames}>
            {props.children}
        </div>
    )
}

export const FormRow = (props) => {
    const formRowClassNames = classNames('form-row' , props.className)

    return (
        <div {...props} className={formRowClassNames}>
            {props.children}
        </div>
    )
}

export const FormCol = (props) => {
    const formColClassNames = classNames('form-col' , props.className)

    return (
        <div {...props} className={formColClassNames}>
            {props.children}
        </div>
    )

}

export const FormLabel = (props) => {
    const formLabelClassNames = classNames('form-label' , props.className)

    return (
        <label {...props} className={formLabelClassNames}>{props.children}</label>
    )

}

export const FormControl = (props) => {
    const formControlClassNames = classNames('form-control' , props.className)

    switch(props.type) {
        case "select":
            return (
                <select {...props} className={formControlClassNames}> {props.children} </select>
            )
        case "textarea":
            return (
                <textarea {...props} className={formControlClassNames}/>
            )
        default:
            return <input {...props} className={formControlClassNames} type={props.type || "text"}/>
    }
}

export const FormSwitch = (props) => {
    return (
        <label className="switch">
            <input type="checkbox" {...props}/>
            <span className="slider"/>
        </label>

    )
}