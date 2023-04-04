
export const iotaInit = () => {
    let _value = 0
    return () => {
        _value += 1
        return _value
    }
}

export const iota = iotaInit()

export const isNotEmpty = (val: any) => (typeof val === 'string' && val != "") ||
    (typeof val === "number" && val > 0) ||
    (Array.isArray(val) && val.length)

export const isEmptyField = (val: any) => (typeof val === 'string' && val === "") ||
    (typeof val === "number" && val == 0) ||
    (Array.isArray(val) && (val.length == 0 || !isNotEmpty(val[0])))
