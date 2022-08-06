import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import React from 'react';

import { BankApp } from '../../../apps/bank';
import CameraApp from '../../../apps/camera/components/CameraApp';
import { ContactsApp } from '../../../apps/contacts';
import { DialerApp } from '../../../apps/dialer';
import { MessagesApp } from '../../../apps/messages';
import { NotesApp } from '../../../apps/notes';
import PhotoApp from '../../../apps/photo/components/PhotoApp';
import { SettingsApp } from '../../../apps/settings/components/SettingsApp';
import { SocietyContactsApp } from '../../../apps/society-contacts';
import { SocietyMessagesApp } from '../../../apps/society-messages';
import { TwitchNewsApp } from '../../../apps/twitch-news';
import { ZutomApp } from '../../../apps/zutom/ZutomApp';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    path: string;
    home?: boolean;
    component: JSX.Element;
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
        component: <DialerApp />,
    },
    {
        id: 'messages',
        nameLocale: 'APPS_MESSAGES',
        path: '/messages',
        home: true,
        component: <MessagesApp />,
    },
    {
        id: 'contacts',
        nameLocale: 'APPS_CONTACTS',
        path: '/contacts',
        home: true,
        component: <ContactsApp />,
    },
    {
        id: 'bank',
        nameLocale: 'APPS_BANK',
        path: '/bank',
        component: <BankApp />,
    },
    {
        id: 'notes',
        nameLocale: 'APPS_NOTES',
        path: '/notes',
        component: <NotesApp />,
    },
    {
        id: 'society-contacts',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        path: '/society-contacts',
        component: <SocietyContactsApp />,
    },
    {
        id: 'photo',
        nameLocale: 'APPS_PHOTO',
        path: '/photo',
        component: <PhotoApp />,
    },
    {
        id: 'settings',
        nameLocale: 'APPS_SETTINGS',
        path: '/settings',
        component: <SettingsApp />,
    },
    {
        id: 'society-messages',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        path: '/society-messages',
        component: <SocietyMessagesApp />,
    },
    {
        id: 'twitch-news',
        nameLocale: 'APPS_TWITCH_NEWS',
        path: '/twitch-news',
        component: <TwitchNewsApp />,
    },
    {
        id: 'zutom',
        nameLocale: 'APPS_ZUTOM',
        path: '/zutom',
        component: <ZutomApp />,
    },
    {
        id: 'camera',
        nameLocale: 'APPS_CAMERA',
        path: '/camera',
        home: true,
        component: <CameraApp />,
    },
];
