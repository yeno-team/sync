import React from 'react';
import classNames from 'classnames';
import './index.css';

export const FormGroup = ({
    className,
    children
}) => {
    const formGroupClassNames = classNames('form-group' , className)
    
    return (
        <div className={formGroupClassNames}>
            {children}
        </div>
    )
}

export const FormRow = ({
    children,
    className
}) => {
    const formRowClassNames = classNames('form-row' , className)

    return (
        <div className={formRowClassNames}>
            {children}
        </div>
    )
}

export const FormCol = ({
    children,
    className
}) => {
    const formColClassNames = classNames('form-col' , className)

    return (
        <div className={formColClassNames}>
            {children}
        </div>
    )

}

export const FormLabel = ({
    className,
    children,
    controlId,
    formId,
    style
}) => {
    const formLabelClassNames = classNames('form-label' , className)

    return (
        <label htmlFor={controlId} form={formId} className={formLabelClassNames} style={style}>{children}</label>
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