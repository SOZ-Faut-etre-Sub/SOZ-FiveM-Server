import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import React from 'react';

import { BankApp } from '../../../apps/bank/components/BankApp';
import CameraApp from '../../../apps/camera/components/CameraApp';
import { ContactsApp } from '../../../apps/contacts/components/ContactsApp';
import { CONTACTS_APP_TEXT_COLOR } from '../../../apps/contacts/contacts.theme';
import { DialerApp } from '../../../apps/dialer/components/DialerApp';
import { DIALER_APP_TEXT_COLOR } from '../../../apps/dialer/dialer.theme';
import { MessagesApp } from '../../../apps/messages/components/MessagesApp';
import { MESSAGES_APP_TEXT_COLOR } from '../../../apps/messages/messages.theme';
import { NOTES_APP_ICON_COLOR } from '../../../apps/notes/notes.theme';
import { NotesApp } from '../../../apps/notes/NotesApp';
import PhotoApp from '../../../apps/photo/components/PhotoApp';
import { SettingsApp } from '../../../apps/settings/components/SettingsApp';
import { SocietyContactsApp } from '../../../apps/society-contacts/components/SocietyContactsApp';
import { SOCIETY_CONTACTS_APP_TEXT_COLOR } from '../../../apps/society-contacts/contacts.theme';
import { SocietyMessagesApp } from '../../../apps/society-messages/components/SocietyMessagesApp';
import { SOCIETY_MESSAGES_APP_TEXT_COLOR } from '../../../apps/society-messages/messages.theme';
import { TwitchNewsApp } from '../../../apps/twitch-news/components/TwitchNewsApp';
import { ZutomApp } from '../../../apps/zutom/ZutomApp';
import { AppRoute } from '../components/AppRoute';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    color: string;
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
        color: DIALER_APP_TEXT_COLOR,
        path: '/phone',
        home: true,
        Route: () => <AppRoute path="/phone" component={DialerApp} />,
    },
    {
        id: 'messages',
        nameLocale: 'APPS_MESSAGES',
        color: MESSAGES_APP_TEXT_COLOR,
        path: '/messages',
        home: true,
        Route: () => <AppRoute path="/messages" component={MessagesApp} />,
    },
    {
        id: 'contacts',
        nameLocale: 'APPS_CONTACTS',
        color: CONTACTS_APP_TEXT_COLOR,
        path: '/contacts',
        home: true,
        Route: () => <AppRoute path="/contacts" component={ContactsApp} />,
    },
    {
        id: 'bank',
        nameLocale: 'APPS_BANK',
        color: 'common.white',
        path: '/bank',
        Route: () => <AppRoute path="/bank" component={BankApp} />,
    },
    {
        id: 'notes',
        nameLocale: 'APPS_NOTES',
        color: NOTES_APP_ICON_COLOR,
        path: '/notes',
        Route: () => <AppRoute path="/notes" component={NotesApp} />,
    },
    {
        id: 'society-contacts',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        color: SOCIETY_CONTACTS_APP_TEXT_COLOR,
        path: '/society-contacts',
        Route: () => <AppRoute path="/society-contacts" component={SocietyContactsApp} />,
    },
    {
        id: 'photo',
        nameLocale: 'APPS_PHOTO',
        color: 'common.white',
        path: '/photo',
        Route: () => <AppRoute path="/photo" component={PhotoApp} />,
    },
    {
        id: 'settings',
        nameLocale: 'APPS_SETTINGS',
        color: 'grey[50]',
        path: '/settings',
        Route: () => <AppRoute path="/settings" component={SettingsApp} />,
    },
    {
        id: 'society-messages',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/society-messages',
        Route: () => <AppRoute path="/society-messages" component={SocietyMessagesApp} />,
    },
    {
        id: 'twitch-news',
        nameLocale: 'APPS_TWITCH_NEWS',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/twitch-news',
        Route: () => <AppRoute path="/twitch-news" component={TwitchNewsApp} />,
    },
    {
        id: 'zutom',
        nameLocale: 'APPS_ZUTOM',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/zutom',
        Route: () => <AppRoute path="/zutom" component={ZutomApp} />,
    },
    /*{
      id: 'marketplace',
      nameLocale: 'APPS_MARKETPLACE',
      color: MARKETPLACE_APP_ICON_COLOR,
      path: '/marketplace',
      Route: () => (
        <AppRoute path="/marketplace" component={MarketplaceApp} emitOnOpen={false} />
      ),
    },*/
    {
        id: 'camera',
        nameLocale: 'APPS_CAMERA',
        color: 'common.white',
        path: '/camera',
        home: true,
        Route: () => <AppRoute path="/camera" component={CameraApp} />,
    },
];
