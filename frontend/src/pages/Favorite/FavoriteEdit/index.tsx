import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";

import api from "../../../api";
import {doUpdate} from "../../../store/reducer/favorite"

import "./style.css"
import Images from "../../../assets/images";
import {Tag2} from "../Tag";
import Select from "../../../components/Input/select";
import Button from "../../../components/Button";
import Modal, {BTN_CLOSE, BTN_YES} from "../../../components/Modal";
import {notify} from "../../../components/Notify";
import InputText from "../../../components/Input/text";
import Textarea from "../../../components/Input/textarea";
import {Descendant} from "slate";

type EditFavoriteProps = {
    id: number
    onClose: () => void
}

const FavoriteEdit = (p: EditFavoriteProps) => {
    const nameRef = useRef()
    const dispatch = useDispatch()
    const [state, setState] = useState<{
        showRemoveModal: boolean
        favorite: FavoriteI
        tags: TagI[]
        selectTag: string
        isEdit: { [name: string]: boolean }
        reachText: Descendant[]
        loading: boolean
    }>({
        showRemoveModal: false,
        favorite: {id: 0, name: "", tags: [], text: "", url: ""},
        tags: [],
        selectTag: "",
        isEdit: {},
        reachText: [{
            children: [{
                text: ""
            }]
        }],
        loading: false
    })
    const [formTags, setFormTags] = useState<{
        favoriteId: number
        tags: string[]
    }>({
        favoriteId: 0,
        tags: []
    })

    const onRemove = () => {
        api.favorite.remove(p.id)
            .then(res => {
                if (res.success) {
                    setState(s => ({...s, showRemoveModal: false}))
                    notify.success("Удалено")
                    dispatch(doUpdate())
                    p.onClose()
                } else {
                    notify.error(res.error)
                }
            })
    }

    const handleUpdateTags = (payload: { favoriteId: number, tags: string[] }) => {
        api.favorite.updTags(payload)
            .then(res => {
                if (res.tags) {
                    setState(s => ({
                        ...s,
                        favorite: {
                            ...s.favorite,
                            tags: res.tags
                        }
                    }))
                    dispatch(doUpdate())
                }
            })
    }

    const addTag = () => {
        setFormTags(f => ({...f, tags: [...f.tags, state.selectTag]}))
        let payload = {
            favoriteId: state.favorite.id,
            tags: state.favorite.tags.map(v => v.name),
        }
        payload.tags.push(state.selectTag)
        handleUpdateTags(payload)
        setState(s => ({...s, selectTag: ""}))
    }

    const removeTag = (name: string) => {
        setFormTags(f => ({...f, tags: [...f.tags.filter(v => v != name)]}))
        let payload = {
            favoriteId: state.favorite.id,
            tags: state.favorite.tags.filter(v => v.name != name).map(v => v.name),
        }
        handleUpdateTags(payload)
        setState(s => ({...s, selectTag: ""}))
    }

    const onChangeFavorite = (e: any) => {
        setState(s => ({
            ...s,
            favorite: {
                ...s.favorite,
                [e.target.name]: e.target.value
            }
        }))
    }

    const onClickAttr = (e: any) => {
        setState(s => ({
            ...s,
            isEdit: {
                ...s.isEdit,
                [e.target.id]: true
            }
        }))
    }

    const updateFavorite = () => {
        api.favorite.update({...state.favorite})
            .then(res => {
                if (res.error) {
                    notify.error("Ошибка обновлениея")
                    console.error(res.error)
                } else if (res.id) {
                    notify.success("Обновлено")
                }
            })
    }

    const onBlurFavorite = (e: any) => {
        setState(s => ({
            ...s,
            isEdit: {
                ...s.isEdit,
                [e.target.name]: false
            }
        }))
        updateFavorite()
        dispatch(doUpdate())
    }

    const onChangeText = (e: Descendant[]) => {
        setState(s => ({
            ...s,
            favorite: {
                ...s.favorite,
                text: JSON.stringify(e)
            },
            reachText: e
        }))
    }

    const onSaveText = () => {
        updateFavorite()
    }

    const parseToReachText = (s: string): any[] => {
        try {
            return (JSON.parse(s) as Descendant[])
        } catch (e) {
            return [{children: [{text: ""}]}]
        }
    }

    useEffect(() => {
        setState(s => ({...s, loading: true}))
        api.favorite.get(p.id)
            .then(res => {
                setState(s => ({
                    ...s,
                    favorite: res,
                    reachText: parseToReachText(res.text)
                }))
                setFormTags({
                    favoriteId: res.id || 0,
                    tags: res.tags.map(v => v.name)
                })
            })
            .finally(() => {
                setState(s => ({...s, loading: false}))
            })
    }, [p.id])

    useEffect(() => {
        api.tag.all()
            .then(res => setState(s => ({...s, tags: res})))
    }, [])

    return <div className="favorite_edit__container border">
        <div className="favorite_edit__top_menu border">
            <button style={{minWidth: 50}} className="btn btn-outline-danger remove"
                    onClick={() => setState(s => ({...s, showRemoveModal: !s.showRemoveModal}))}>
                {Images.remove}
            </button>
        </div>
        <div className="favorite_edit__body">
            <div className="name">
                {!state.isEdit?.name
                    ? <div id={"name"} onClick={onClickAttr}>{state.favorite.name}</div>
                    : <InputText name={"name"} value={state.favorite.name} onBlur={onBlurFavorite}
                                 onChange={onChangeFavorite}/>}
            </div>
            <div className="url">
                <label>{Images.link}</label>
                {!state.isEdit?.url
                    ? <div id={"url"} onClick={onClickAttr}>{state.favorite.url}</div>
                    : <InputText id={"url"} name={"url"} value={state.favorite.url} onBlur={onBlurFavorite}
                                 onChange={onChangeFavorite}/>
                }
            </div>
            <div className="d-flex flex-row align-content-between w-100 mb-1">
                {state.favorite.tags.map((v, i) => <div key={i} style={{marginRight: 5}}><Tag2
                    onClose={() => removeTag(v.name)}>
                    {v.name}
                </Tag2></div>)}
                <div className="favorite_edit__add_tag">
                    <Select
                        options={[{value: "", label: "--"}, ...state.tags
                            .filter(v => !Boolean(formTags.tags.indexOf(v.name) + 1))
                            .map((v) => ({value: v.name, label: v.name}))]}
                        onChange={(_, value) => setState(s => ({...s, selectTag: value}))}
                        currentValue={state.selectTag}
                    />
                    {state.selectTag && <Button className="btn-outline-primary" onClick={addTag}>{Images.add}</Button>}
                </div>
            </div>
            <Button className="btn-outline-primary" onClick={onSaveText}>
                {Images.save}
            </Button>
            <div className="text">
                {!state.loading && <Textarea value={state.reachText} onChange={onChangeText}/>}
            </div>
        </div>

        <Modal
            onClose={() => setState(s => ({...s, showRemoveModal: false}))}
            isOpen={state.showRemoveModal}
            title={"Удаление"}
            body={<div>
                Вы хотите удалить "{state.favorite.name}"?
            </div>}
            btnNum={BTN_CLOSE | BTN_YES}
            onYes={onRemove}
        />
    </div>
}

export default FavoriteEdit
