import {configureStore} from '@reduxjs/toolkit'

import applicationSlice from "./reducer/application";
import favoriteSlice from "./reducer/favorite"


export const store = configureStore({
    reducer: {
        application: applicationSlice,
        favorite: favoriteSlice,
    },
})
