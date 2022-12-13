import React from 'react'
import ReactDOM from 'react-dom/client'

import "inter-ui/inter.css";
import './index.css';

import KeyInventory from './components/KeyInventory';
import { PlayerContainer } from './components/Container/Player/PlayerContainer';
import { StorageContainer } from './components/Container/Storage/StorageContainer';

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <PlayerContainer />
        <StorageContainer />
        {/*<KeyInventory />*/}
    </React.StrictMode>
)
