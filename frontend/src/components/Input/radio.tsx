import React from "react";

// @ts-ignore
export const RadioItem = ({name, title, value, id, checked, onChange, disabled=false}) => {
    return <div className="form-check" style={{marginRight: 15}}>
        <label htmlFor={id}>{title}</label>
        <input className="form-check-input" type="radio" name={name} id={id} value={value} checked={checked}
               onChange={onChange}
               disabled={disabled}
        />
    </div>
}

type GroupRadioProps = {
    options: {
        label: string
        value: any
        disabled?: boolean
    }[]
    name: string
    onChange?: any
    value: any
    className?: string
    readOnly?: boolean
}

const GroupRadio = ({options, name, onChange, value, className="", readOnly=false}: GroupRadioProps) => {

    return <div className={`d-flex ${className}`}>
        {options?.map((v, i) => <RadioItem
            key={i}
            title={v.label}
            value={v.value}
            checked={v.value == value}
            name={name}
            id={`${name}_${i}`}
            onChange={onChange}
            disabled={readOnly || v.disabled}
        />)}
    </div>
}

export default GroupRadio
