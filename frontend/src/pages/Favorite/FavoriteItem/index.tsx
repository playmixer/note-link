import React from "react";
import Tag from "../Tag";
import Images from "../../../assets/images";
import "./style.css"


type FavoriteItemProps = {
    item: FavoriteI
    onClick: (id?: number) => void
}

const FavoriteItem = (p: FavoriteItemProps) => {

    const _item = (f: FavoriteI) => {
        return <div className="d-flex flex-row justify-content-between align-items-start border p-2 border-1 favorite_item">
            <div>
                <div className="d-flex flex-row">
                    {f.url && <a href={f.url} target="_blank" className="text-decoration-none link-dark item_url">
                        {Images.link}
                    </a>}
                    <div className="item_title" onClick={() => p.onClick(f.id)}>
                        <h5>{p.item.name}</h5>
                    </div>
                </div>
                <div className="d-flex flex-row flex-wrap">
                    {p.item.tags.map((tag, i) => <div key={i} className="m-1"><Tag>{tag.name}</Tag></div>)}
                </div>
            </div>
        </div>
    }

    return <div style={{borderRadius: 5}}>
        {_item(p.item)}
    </div>
}

export default FavoriteItem
