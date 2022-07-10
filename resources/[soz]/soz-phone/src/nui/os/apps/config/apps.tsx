import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import React from 'react';

import { BankApp } from '../../../apps/bank/components/BankApp';
import CameraApp from '../../../apps/camera/components/CameraApp';
import { ContactsApp } from '../../../apps/contacts/components/ContactsApp';
import { DialerApp } from '../../../apps/dialer/components/DialerApp';
import { MessagesApp } from '../../../apps/messages/components/MessagesApp';
import { NotesApp } from '../../../apps/notes/NotesApp';
import PhotoApp from '../../../apps/photo/components/PhotoApp';
import { SettingsApp } from '../../../apps/settings/components/SettingsApp';
import { SocietyContactsApp } from '../../../apps/society-contacts/components/SocietyContactsApp';
import { SocietyMessagesApp } from '../../../apps/society-messages/components/SocietyMessagesApp';
import { TwitchNewsApp } from '../../../apps/twitch-news/components/TwitchNewsApp';
import { ZutomApp } from '../../../apps/zutom/ZutomApp';
import { AppRoute } from '../components/AppRoute';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    path: string;
    home?: boolean;
    Route: React.FC;
}

export type IApp = IAppConfig & {
    notification: INotificationIcon;
    icon: JSX.Element;
    notificationIcon: JSX.Element;
    NotificationIcon: React.FC<any>;
};

export const APPS: IAppConfig[] = [
    {
        id: 'dialer',
        nameLocale: 'APPS_DIALER',
        path: '/phone',
        home: true,
        Route: () => <AppRoute path="/phone" component={DialerApp} />,
    },
    {
        id: 'messages',
        nameLocale: 'APPS_MESSAGES',
        path: '/messages',
        home: true,
        Route: () => <AppRoute path="/messages" component={MessagesApp} />,
    },
    {
        id: 'contacts',
        nameLocale: 'APPS_CONTACTS',
        path: '/contacts',
        home: true,
        Route: () => <AppRoute path="/contacts" component={ContactsApp} />,
    },
    {
        id: 'bank',
        nameLocale: 'APPS_BANK',
        path: '/bank',
        Route: () => <AppRoute path="/bank" component={BankApp} />,
    },
    {
        id: 'notes',
        nameLocale: 'APPS_NOTES',
        path: '/notes',
        Route: () => <AppRoute path="/notes" component={NotesApp} />,
    },
    {
        id: 'society-contacts',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        path: '/society-contacts',
        Route: () => <AppRoute path="/society-contacts" component={SocietyContactsApp} />,
    },
    {
        id: 'photo',
        nameLocale: 'APPS_PHOTO',
        path: '/photo',
        Route: () => <AppRoute path="/photo" component={PhotoApp} />,
    },
    {
        id: 'settings',
        nameLocale: 'APPS_SETTINGS',
        path: '/settings',
        Route: () => <AppRoute path="/settings" component={SettingsApp} />,
    },
    {
        id: 'society-messages',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        path: '/society-messages',
        Route: () => <AppRoute path="/society-messages" component={SocietyMessagesApp} />,
    },
    {
        id: 'twitch-news',
        nameLocale: 'APPS_TWITCH_NEWS',
        path: '/twitch-news',
        Route: () => <AppRoute path="/twitch-news" component={TwitchNewsApp} />,
    },
    {
        id: 'zutom',
        nameLocale: 'APPS_ZUTOM',
        path: '/zutom',
        Route: () => <AppRoute path="/zutom" component={ZutomApp} />,
    },
    /*{
      id: 'marketplace',
      nameLocale: 'APPS_MARKETPLACE',
      path: '/marketplace',
      Route: () => (
        <AppRoute path="/marketplace" component={MarketplaceApp} emitOnOpen={false} />
      ),
    },*/
    {
        id: 'camera',
        nameLocale: 'APPS_CAMERA',
        path: '/camera',
        home: true,
        Route: () => <AppRoute path="/camera" component={CameraApp} />,
    },
];
