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
        <label {...props} className={formLabelClassNames}/>
    )

}

export const FormControl = (props) => {
    const { type , inputRef , className , ...rest} = props

    const formControlClassNames = classNames('form-control' , className)

    switch(type) {
        case "select":
            return (
                <select {...rest} ref={inputRef} className={formControlClassNames}/>
            )
        case "textarea":
            return (
                <textarea {...rest} ref={inputRef} className={formControlClassNames}/>
            )
        default:
            return <input {...rest} ref={inputRef} className={formControlClassNames} type={type || "text"}/>
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