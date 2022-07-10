import './main.css';
import './i18n';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NuiProvider } from 'fivem-nui-react-lib';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import { RecoilRootManager } from './lib/RecoilRootManager';
import { PhoneProviders } from './PhoneProviders';

dayjs.extend(relativeTime);

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <NuiProvider resource="npwd">
                <React.Suspense fallback={null}>
                    <RecoilRootManager>
                        <PhoneProviders />
                    </RecoilRootManager>
                </React.Suspense>
            </NuiProvider>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
