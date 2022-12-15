import React from 'react'
import ReactDOM from 'react-dom/client'

import "inter-ui/inter.css";
import './index.css';

import { PlayerContainer } from './components/Container/Player/PlayerContainer';
import { StorageContainer } from './components/Container/Storage/StorageContainer';
import { KeyContainer } from './components/Container/Key/KeyContainer';

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <PlayerContainer />
        <StorageContainer />
        <KeyContainer />
    </React.StrictMode>
)
