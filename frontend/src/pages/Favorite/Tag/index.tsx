import React from "react";
import "./style.css"
import Images from "../../../assets/images";

type TagProps = {
    children: React.ReactNode
    onClick?: () => void
    onClose?: () => void
}

const Tag = (p: TagProps) => {
    return <div className="badge bg-primary" style={{cursor: "pointer"}} onClick={p.onClick}>
        {p.children}
    </div>
}

export const Tag2 = (p: TagProps) => {
    return <div className="tag_item">
        {p.children}<div className="remove" onClick={p.onClose}>{Images.close}</div>
    </div>
}

export default Tag

