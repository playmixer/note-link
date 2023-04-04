export const formatDate = (s = "", format = "dd.mm.YYYY") => {
    if (s === "") return ""
    // s = 1998-11-18
    const [year, month, day] = s?.substring(0, 10).split("-")
    let res: string[] = []
    const _format = format.split(".")
    _format.map((v) => {
        if (v === "dd") res.push(day)
        if (v === "mm") res.push(month)
        if (v === "YYYY") res.push(year)
    })
    return res.join(".")
}
export const formatDateTime = (s = "", format = "dd.mm.YYYY") => {
    const date = new Date(s)

    return `${setLen(date.getDate(), "0", 2)}.${setLen(date.getMonth() + 1, "0", 2)}.${date.getFullYear()} ${date.getHours()}:${setLen(date.getMinutes(), "0", 2)}:${setLen(date.getSeconds(), "0", 2)}`
}

export const formatDateToInput = (d: Date) => {
    let month: number|string = (d.getMonth() + 1)
    if (month < 10) month = '0' + month
    let day: number|string = d.getDate()
    if (day < 10) day = '0' + day
    let date = d.getFullYear() + '-' + month + '-' + day
    return date
}

export function capitalizeFirstLetter(string: string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export const shorty = (text: string, len: number) =>
    (text || "").substring(0, len) + (text?.length > len ? "..." : "")

export const setLen = (s: any, sym: string, len: number, isPref = true) => {
    const l = s.toString().length
    let subStr = ""
    for (let i = 0; i <= len - l; i++) {
        subStr += sym
    }
    if (isPref)
        return subStr.substring(0, len - l) + s.toString()
    return s.toString() + subStr.substring(0, len - l)
}
