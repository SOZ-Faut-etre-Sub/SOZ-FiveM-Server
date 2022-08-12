import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import React from 'react';

import { BankApp } from '../../../apps/bank';
import BankIcon from '../../../apps/bank/icon';
import CameraApp from '../../../apps/camera/components/CameraApp';
import CameraIcon from '../../../apps/camera/icon';
import { ContactsApp } from '../../../apps/contacts';
import ContactIcon from '../../../apps/contacts/icon';
import { DialerApp } from '../../../apps/dialer';
import DialerIcon from '../../../apps/dialer/icon';
import { MessagesApp } from '../../../apps/messages';
import MessagesIcon from '../../../apps/messages/icon';
import { NotesApp } from '../../../apps/notes';
import NotesIcon from '../../../apps/notes/icon';
import PhotoApp from '../../../apps/photo';
import PhotoIcon from '../../../apps/photo/icon';
import { SettingsApp } from '../../../apps/settings';
import SettingsIcon from '../../../apps/settings/icon';
import { SocietyContactsApp } from '../../../apps/society-contacts';
import SocietyContactIcon from '../../../apps/society-contacts/icon';
import { SocietyMessagesApp } from '../../../apps/society-messages';
import SocietyMessagesIcon from '../../../apps/society-messages/icon';
import { TwitchNewsApp } from '../../../apps/twitch-news';
import TwitchNewsIcon from '../../../apps/twitch-news/icon';
import ZutomIcon from '../../../apps/zutom/icon';
import { ZutomApp } from '../../../apps/zutom/ZutomApp';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    path: string;
    home?: boolean;
    component: JSX.Element;
    icon: React.FC<any>;
}

export type IApp = IAppConfig & {
    notification: INotificationIcon;
};

export const APPS: IAppConfig[] = [
    {
        id: 'dialer',
        nameLocale: 'APPS_DIALER',
        path: '/phone',
        home: true,
        component: <DialerApp />,
        icon: DialerIcon,
    },
    {
        id: 'messages',
        nameLocale: 'APPS_MESSAGES',
        path: '/messages',
        home: true,
        component: <MessagesApp />,
        icon: MessagesIcon,
    },
    {
        id: 'contacts',
        nameLocale: 'APPS_CONTACTS',
        path: '/contacts',
        home: true,
        component: <ContactsApp />,
        icon: ContactIcon,
    },
    {
        id: 'bank',
        nameLocale: 'APPS_BANK',
        path: '/bank',
        component: <BankApp />,
        icon: BankIcon,
    },
    {
        id: 'notes',
        nameLocale: 'APPS_NOTES',
        path: '/notes',
        component: <NotesApp />,
        icon: NotesIcon,
    },
    {
        id: 'society-contacts',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        path: '/society-contacts',
        component: <SocietyContactsApp />,
        icon: SocietyContactIcon,
    },
    {
        id: 'photo',
        nameLocale: 'APPS_PHOTO',
        path: '/photo',
        component: <PhotoApp />,
        icon: PhotoIcon,
    },
    {
        id: 'settings',
        nameLocale: 'APPS_SETTINGS',
        path: '/settings',
        component: <SettingsApp />,
        icon: SettingsIcon,
    },
    {
        id: 'society-messages',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        path: '/society-messages',
        component: <SocietyMessagesApp />,
        icon: SocietyMessagesIcon,
    },
    {
        id: 'twitch-news',
        nameLocale: 'APPS_TWITCH_NEWS',
        path: '/twitch-news',
        component: <TwitchNewsApp />,
        icon: TwitchNewsIcon,
    },
    {
        id: 'zutom',
        nameLocale: 'APPS_ZUTOM',
        path: '/zutom',
        component: <ZutomApp />,
        icon: ZutomIcon,
    },
    {
        id: 'camera',
        nameLocale: 'APPS_CAMERA',
        path: '/camera',
        home: true,
        component: <CameraApp />,
        icon: CameraIcon,
    },
];
