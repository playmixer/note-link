import {createSlice} from '@reduxjs/toolkit'


const initialState: FavoriteStore = {
    filter: [],
    update: false,
}

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setFilter: (state: FavoriteStore, action) => {
            state = {
                ...state,
                filter: [action.payload]
            }
            return state
        },
        cleanFilter: (state: FavoriteStore) => {
            state = {
                ...state,
                filter: []
            }
            return state
        },
        doUpdate: (state: FavoriteStore) => {
            state = {
                ...state,
                update: true
            }
            return state
        },
        updated: (state: FavoriteStore) => {
            state = {
                ...state,
                update: false
            }
            return state
        }
    },
})

export const {setFilter, cleanFilter, doUpdate, updated} = favoriteSlice.actions

export default favoriteSlice.reducer
