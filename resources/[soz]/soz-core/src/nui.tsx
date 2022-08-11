import { createRoot } from 'react-dom/client';

import { App } from './nui/components/App';
import { NuiProvider } from './nui/components/Nui/providers/NuiProvider';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <NuiProvider resource="soz-core">
        <App />
    </NuiProvider>
);
