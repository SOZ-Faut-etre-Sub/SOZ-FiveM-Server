import React from 'react';
import {NotificationsProvider} from '@os/notifications/providers/NotificationsProvider';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import {SoundProvider} from '@os/sound/providers/SoundProvider';
import ThemeProvider from "./styles/themeProvider";


export const PhoneProviders = () => {
    return (
        <SoundProvider>
            <ThemeProvider>
                <NotificationsProvider>
                    <SnackbarProvider>
                        <Phone/>
                    </SnackbarProvider>
                </NotificationsProvider>
            </ThemeProvider>
        </SoundProvider>
    );
};
