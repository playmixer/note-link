import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux'

import "./style.css"

import {cleanFilter, updated, doUpdate} from "../../store/reducer/favorite"

import api from "../../api/index"
import FavoriteItem from "./FavoriteItem";

import Modal, {BTN_CLOSE, BTN_SAVE} from "../../components/Modal";
import Button from "../../components/Button";
import InputText from "../../components/Input/text";
import {notify} from "../../components/Notify";
import Layout from "../Layout";
import MenuLeft from "./MenuLeft";
import EditFavorite from "./FavoriteEdit";

type FavoriteMainBlockProps = {
    onClickFavorite: (id?: number) => void
}

const FavoriteMainBlock = (p: FavoriteMainBlockProps) => {
    const {favorite} = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()

    const [favorites, setFavorites] = useState<FavoriteI[]>([])

    const [state, setState] = useState({
        showNewFavorite: false,
    })
    const [formFavorite, setFormFavorite] = useState<{
        name: string
        tags: string[]
        text: string
        url: string
    }>({
        name: "",
        tags: [],
        text: "",
        url: ""
    })

    const onChangeForm = (e: any) => {
        setFormFavorite(f => ({
            ...f,
            [e.target.name]: e.target.value
        }))
    }

    const handleNewFavorite = () => {
        api.favorite.add(formFavorite)
            .then(res => {
                if (res.success) {
                    setState(s => ({...s, showNewFavorite: false}))
                    notify.success("Закладка добавлена")
                    dispatch(doUpdate())
                }
            })
    }


    const loadFavorites = () => {
        api.favorite.all(favorite.filter)
            .then(res => setFavorites(res))
    }

    useEffect(() => {
        if (favorite.update) {
            dispatch(updated())
            loadFavorites()
        }

    }, [favorite.update])

    useEffect(() => {
        loadFavorites()
    }, [favorite.filter])

    useEffect(() => {
        loadFavorites()
    }, [])

    return <div className="favorite_middle_block">
        <div className="favorite_middle_block__menu">
            <Button className="btn-outline-primary" style={{marginRight: 10}}
                    onClick={() => setState(s => ({...s, showNewFavorite: true}))}>
                Добавить закладку
            </Button>
        </div>
        <div className="favorite_middle_block__filter mb-1">
            <div className="filter_title">Фильтр</div>
            <div className="filter_body">
                {favorite.filter.map((v, i) => <div className="m-1" key={i} onClick={_ => dispatch(cleanFilter())}>
                    <div className="filter_item btn btn-success">{v}</div>
                </div>)}
            </div>
        </div>
        <div className="favorite_middle_block__items">
            {favorites?.map((v, i) => <div className="favorite_item" key={i}>
                <FavoriteItem item={v} onClick={p.onClickFavorite}/>
            </div>)}
        </div>
        <Modal
            onClose={() => setState(s => ({...s, showNewFavorite: false}))}
            isOpen={state.showNewFavorite}
            title={"Добавить заметку"}
            body={<div>
                <div className="mb-1">
                    <InputText name={"name"} value={formFavorite.name} onChange={onChangeForm}/>
                </div>
            </div>}
            onSave={handleNewFavorite}
            btnNum={BTN_SAVE | BTN_CLOSE}
        />
    </div>
}

type FavoriteProps = {}

const Favorite = (p: FavoriteProps) => {
    const [state, setState] = useState<{
        favoriteId: number | null
    }>({
        favoriteId: null
    })

    return <Layout>
        <div className="d-flex flex-row w-100">
            <MenuLeft/>
            <FavoriteMainBlock onClickFavorite={(id = 0) => setState(s => ({...s, favoriteId: id}))}/>
            {state.favoriteId && <EditFavorite id={state.favoriteId} onClose={() => setState(s => ({...s, favoriteId: null}))}/>}
        </div>
    </Layout>
}

export default Favorite
