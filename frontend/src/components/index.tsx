import React from "react";
import {useSelector, useDispatch} from "react-redux"
import Favorite from "../pages/Favorite";


const Index = () => {
    const app = useSelector((state: RootStore) => state.application)
    const dispatch = useDispatch()

    switch (app.currentView as TypeView) {
        case "favorites":
            return <Favorite/>
        default:
            return <div></div>
    }
}

export default Index
