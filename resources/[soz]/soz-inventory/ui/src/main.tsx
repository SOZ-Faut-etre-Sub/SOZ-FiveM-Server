import React from 'react'
import ReactDOM from 'react-dom/client'

import "inter-ui/inter.css";
import './index.css';

import KeyInventory from './components/KeyInventory';
import ContainerInventory from './components/ContainerInventory';
import { PlayerContainer } from './components/Container/Player/PlayerContainer';

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <PlayerContainer />
        {/*<KeyInventory />*/}
        {/*<ContainerInventory />*/}
    </React.StrictMode>
)
