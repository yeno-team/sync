import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import classNames from 'classnames';

export default function Modal({
    children,
    show,
    onHide,
    className
}) {
    const showModal = typeof(show) === "undefined" ? true : show;

    if(!showModal) {
        // Show the scrollbar on the body.
        document.body.style.overflow = "visible"
        return null;
    }

    // Hide the scrollbar on the body.
    document.body.style.overflow = "hidden"

    const modalClassNames = classNames([
        'modal',
        className
    ])

    const handleClose = typeof(onHide) === "function" ? () => onHide() : undefined

    const handleModalClose = (ev) => {
        const targetElement = ev.target
        const classList = targetElement.classList

        if(classList.contains("modal-close")) {
            handleClose()
        }
    }

    return ReactDOM.createPortal((
        <React.Fragment>
           <div className="modal-overlay" onClick={handleClose}/>
           <div className={modalClassNames} onClick={handleClose && handleModalClose}>
                {/* handleClose must be a truthy value for the modal element to have an click event listener. */}
               {children}
           </div>
        </React.Fragment> 
    ) , document.body)
}


export function ModalHeader({
    children,
    className,
    closeButton
}) {
    const modalHeaderClassNames = classNames([
        'modal-header',
        className
    ])

    return (
        <div className={modalHeaderClassNames}>
            {children}
            {closeButton && <div className="modal-close exit"/>}
        </div>
    )
}

export function ModalBody({
    children,
    className
}) {
    const modalBodyClassNames = classNames([
        'modal-body',
        className
    ])

    return (
        <div className={modalBodyClassNames}>
            {children}
        </div>
    )
}

export function ModalFooter({
    children,
    className
}) {
    const modalFooterClassNames = classNames([
        'modal-footer',
        className
    ])

    return (
        <div className={modalFooterClassNames}>
            {children}
        </div>
    )
}