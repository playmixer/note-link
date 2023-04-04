import { createSlice } from '@reduxjs/toolkit'


const initialState: ApplicationStore = {
    currentView: "favorites"
}

export const applicationSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setView: (state, action) => {
            state = {
                ...state,
                currentView: action.payload
            }
            return state
        },
    },
})

export const { setView } = applicationSlice.actions

export default applicationSlice.reducer
