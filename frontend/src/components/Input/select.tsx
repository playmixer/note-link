import React, {ReactNode} from "react";

type SelectProps = {
    className?: string
    options: {
        label: any
        value: any
    }[]
    mapper?: (option: any) => ReactNode
    currentValue?: any
    onChange: (name: string, value: string) => void
    name?: string
    title?: string
    defaultValue?: any
}

const Select = (p: SelectProps) => {
    const {defaultValue = undefined} = p

    const handleChange = (e: any) => {
        p.onChange(e.target.name, e.target.value)
    }

    return <div className={`d-flex w-100 ${p.className}`}>
        {p.title && <label htmlFor={p.name} style={{marginRight: 5, marginBottom: 5}}>{p.title}</label>}
        <select
            className="form-select w-100" name={p.name} id={p.name} value={defaultValue != undefined ? defaultValue : p.currentValue}
            onChange={handleChange}
        >
            {p.options.map((v, i) => {
                if (p.mapper)
                    return p.mapper(v)
                return <option key={i} value={v.value}>{v.label}</option>
            })}
        </select>
    </div>
}

export default Select
