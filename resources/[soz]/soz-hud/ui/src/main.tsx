import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app';
import './style/index.css';

window.addEventListener('message', (event: MessageEvent) => {
    if (event.data.action === 'ping') {
        fetch(`https://soz-hud/pong`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({data: 'pong'}),
        });
    }
});

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
