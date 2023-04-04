import React from "react";

type CheckboxProps = {
    className?: string
    name?: string
    checked?: any
    defaultChecked?: any
    title: any
    onChange?: any
}

const Checkbox = ({name, checked, title, onChange, className, defaultChecked}: CheckboxProps) => {

    return <div className={`form-check ${className || ""}`}>
        <input className="form-check-input" type="checkbox" id={name} name={name} checked={checked} onChange={onChange} defaultChecked={defaultChecked}/>
        <label className="form-check-label" htmlFor={name}>{title}</label>
    </div>
}

export default Checkbox
