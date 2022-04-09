import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app';
import './style/index.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
