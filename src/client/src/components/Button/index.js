import React from 'react';
import variants from '../variants';
import classNames from 'classnames';
import './index.css';

const animationStyles = [
    "filled",
    "underline",
]

export default function Button(props) {
    const {
        variant,
        animated,
        animatedColor,
        animatedStyle,
        className,
        ...rest
    } = props

    const btnClasses = [
        "btn",
        { "btn-animated" : animated ? true : false },
        `btn-${variants.includes(variant) ? variant : "blue"}`,
        className
     ]

    if(animated) {
        animatedColor && variants.includes(animatedColor) ? btnClasses.push(`btn-animated-color-${animatedColor}`) : btnClasses.push(`btn-animated-color-white`)

        if(animatedStyle && animationStyles.includes(animatedStyle)) {
            btnClasses.push(`btn-animated-style-${animatedStyle}`)

            if(animatedStyle === "filled") {
                // Remove the variant background from the btnClasses array
                btnClasses.splice(btnClasses.indexOf(`btn-${variant}`) , 0)

                // Add in outline style
                btnClasses.push(`btn-${variant}-outline`)
            }
        }
    }

    const btnClassNames = classNames(...btnClasses)

    return (
        <button {...rest} className={btnClassNames} />
    )
}