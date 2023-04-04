import React, {memo} from "react";

type InputTextProps = {
    type?: any
    name?: any
    title?: any
    id?: any
    value: any
    placeholder?: any
    onChange?: any
    onBlur?: any
    isRow?: boolean
    style?: any
    maxLength?: number
    readOnly?: boolean
    inputStyle?: any
    step?: number
    error?: any
}

const InputText = (p: InputTextProps) => {
    const {
        type = "text",
        name,
        title,
        id,
        value,
        placeholder,
        onChange,
        onBlur,
        isRow = true,
        style = {},
        maxLength,
        readOnly = false,
        inputStyle = {},
        step = 1,
        error,
    } = p

    return <div
        className={`d-flex ${isRow ? 'flex-row' : 'flex-column'} ${isRow ? "align-items-center" : "justify-items-center"}`}
        style={style}>
        {title && <label htmlFor="input" className="form-label" style={{marginRight: 5}}>{title}</label>}
        <input
            type={type}
            className={`form-control ${error ? "border-danger" : ""}`}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            maxLength={maxLength}
            readOnly={readOnly}
            style={inputStyle}
            step={step}
            onBlur={onBlur}
        >
        </input>
        {error && <div className="text-danger">{error}</div>}
    </div>
}

export default memo(InputText)
