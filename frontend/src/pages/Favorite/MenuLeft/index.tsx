import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux'

import {setFilter} from "../../../store/reducer/favorite"

import "./style.css"
import api from "../../../api";
import Button from "../../../components/Button";
import Modal, {BTN_CLOSE, BTN_SAVE, BTN_YES} from "../../../components/Modal";
import InputText from "../../../components/Input/text";
import {notify} from "../../../components/Notify";
import Images from "../../../assets/images";


const MenuLeft = () => {
    const [formTag, setFormTag] = useState<string>("")
    const dispatch = useDispatch()
    const [state, setState] = useState<{
        favorites: FavoriteI[]
        tags: TagI[]
        showNewTag: boolean
        showRemoveTagPanel: boolean
        removeTag: TagI | null
    }>({
        favorites: [],
        tags: [],
        showNewTag: false,
        showRemoveTagPanel: false,
        removeTag: null,
    })

    const loadTags = () => {
        api.tag.all()
            .then(res => setState(s => ({...s, tags: res})))
    }

    const handleTagOnClick = (name: string) => {
        dispatch(setFilter(name))
    }

    const handleNewTag = () => {
        api.tag.add(formTag)
            .then(res => {
                if (res && res.id > 0) {
                    setState(s => ({...s, showNewTag: false}))
                    notify.success("Тег добавлен")
                    loadTags()
                } else {
                    notify.error(res.error)
                }
            })
    }

    const deleteTag = () => {
        if (state.removeTag?.id)
            api.tag.remove(state.removeTag?.id)
                .then(res => {
                    if (res.success) {
                        notify.success("Тег удален")
                    }
                    if (res.error) {
                        notify.error(res.error)
                    }
                    setState(s => ({
                        ...s,
                        removeTag: null
                    }))
                })
                .finally(() => {
                    loadTags()
                })

    }

    useEffect(() => {
        api.tag.all()
            .then(res => setState(s => ({...s, tags: res})))
    }, [])

    return <div className="menu_left">
        <div className="menu_title">Теги</div>
        <div className="menu_side">
            {
                !state.showRemoveTagPanel ?
                    <>
                        <div className="tags_list">
                            {
                                state.tags.map((v, i) =>
                                    <Button className="btn-primary" key={i} onClick={() => handleTagOnClick(v.name)}>
                                        {v.name}
                                    </Button>)
                            }

                        </div>
                        <div className="tags_control">
                            <Button className="btn-success add"
                                    onClick={() => setState(s => ({...s, showNewTag: true}))}>
                                {Images.add}
                            </Button>
                            <Button className="btn-danger remove" onClick={() => (setState(s => ({
                                ...s,
                                showRemoveTagPanel: true
                            })))}>{Images.remove}</Button>
                        </div>
                    </>
                    : <>
                        <div className="tags_list">
                            {
                                state.tags.map((v, i) =>
                                    <Button className="btn-outline-danger" key={i}
                                            onClick={() => setState(s => ({...s, removeTag: v}))}>
                                        {v.name}
                                    </Button>)
                            }
                        </div>
                        <div className="tags_control">
                            <Button className="btn-secondary" onClick={() => (setState(s => ({
                                ...s,
                                showRemoveTagPanel: false
                            })))}>Закрыть</Button>
                        </div>
                    </>
            }
        </div>
        <div className="menu_split"/>
        <Modal
            title={"Добавить тег"}
            onClose={() => setState(s => ({...s, showNewTag: false}))}
            body={<div>
                <label className="form-label">Название тега</label>
                <InputText name={"tag_name"} onChange={(e: any) => setFormTag(e.target.value)} value={formTag}/>
            </div>}
            btnNum={BTN_SAVE | BTN_CLOSE}
            onSave={handleNewTag}
            isOpen={state.showNewTag}
        />
        <Modal
            title={"Удаление тега"}
            onClose={() => setState(s => ({...s, removeTag: null}))}
            isOpen={Boolean(state.removeTag)}
            body={<div>
                Удалить тег "{state.removeTag?.name}"? Он будет удален для всех заметок.
            </div>}
            btnNum={BTN_CLOSE | BTN_YES}
            onYes={deleteTag}
        />
    </div>
}

export default MenuLeft
