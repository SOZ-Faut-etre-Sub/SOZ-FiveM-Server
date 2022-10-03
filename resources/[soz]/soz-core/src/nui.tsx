import { createRoot } from 'react-dom/client';

import { App } from './nui/components/App';
import { NuiListener } from './nui/components/NuiListener';

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

window.addEventListener('message', event => {
    if (event.data.string) {
        console.log('Received message from server', event.data.string, new Date());
        copyToClipboard(event.data.string);
    }
});

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <NuiListener>
        <App />
    </NuiListener>
);
