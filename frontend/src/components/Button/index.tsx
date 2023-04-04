import React from "react";

type ButtonProps = {
    children?: React.ReactNode
    disabled?: boolean
} & React.ButtonHTMLAttributes<any>

const Button = (props: ButtonProps) => {
    return <button {...props} className={`btn ${props.className}`} disabled={props.disabled}>{props.children}</button>
}


export default Button
