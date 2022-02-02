import React from 'react';
import {NotificationsProvider} from '@os/notifications/providers/NotificationsProvider';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import {SoundProvider} from '@os/sound/providers/SoundProvider';


export const PhoneProviders = () => {
    return (
        <SoundProvider>
            <NotificationsProvider>
                <SnackbarProvider>
                    <Phone/>
                </SnackbarProvider>
            </NotificationsProvider>
        </SoundProvider>
    );
};
