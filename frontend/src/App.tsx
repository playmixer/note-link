import React from 'react';
import {store} from './store/store'
import {Provider} from 'react-redux'

import './App.css';

import Index from "./components";


function App() {
    return (
        <Provider store={store}>
            <Index/>
        </Provider>
    );
}

export default App;
