import './main.css';
import './i18n';

import { NuiProvider } from '@libs/nui/providers/NuiProvider';
import SnackbarProvider from '@os/snackbar/providers/SnackbarProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { NotificationsProvider } from './os/notifications/providers/NotificationsProvider';
import { SoundProvider } from './os/sound/providers/SoundProvider';
import Phone from './Phone';
import { store } from './store';

dayjs.extend(relativeTime);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <NuiProvider resource="soz-phone">
            <SoundProvider>
                <NotificationsProvider>
                    <SnackbarProvider>
                        <HashRouter>
                            <Phone />
                        </HashRouter>
                    </SnackbarProvider>
                </NotificationsProvider>
            </SoundProvider>
        </NuiProvider>
    </Provider>
);
