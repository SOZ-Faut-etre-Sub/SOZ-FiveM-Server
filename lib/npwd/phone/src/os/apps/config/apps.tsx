import React from 'react';
import {DialerApp} from '../../../apps/dialer/components/DialerApp';
import {ContactsApp} from '../../../apps/contacts/components/ContactsApp';
import {SettingsApp} from '../../../apps/settings/components/SettingsApp';
import {MessagesApp} from '../../../apps/messages/components/MessagesApp';
import {NotesApp} from '../../../apps/notes/NotesApp';
import CameraApp from '../../../apps/camera/components/CameraApp';
import {SocietyContactsApp} from "../../../apps/society-contacts/components/SocietyContactsApp";
import {AppRoute} from '../components/AppRoute';

import {
    MESSAGES_APP_TEXT_COLOR,
} from '../../../apps/messages/messages.theme';
import {
    CONTACTS_APP_TEXT_COLOR,
} from '../../../apps/contacts/contacts.theme';
import {NOTES_APP_ICON_COLOR} from '../../../apps/notes/notes.theme';
import {DIALER_APP_TEXT_COLOR} from '../../../apps/dialer/dialer.theme';
import {INotificationIcon} from '@os/notifications/providers/NotificationsProvider';
import {
    SOCIETY_CONTACTS_APP_TEXT_COLOR
} from "../../../apps/society-contacts/contacts.theme";
import {BankApp} from "../../../apps/bank/components/BankApp";
import {
    SOCIETY_MESSAGES_APP_TEXT_COLOR
} from "../../../apps/society-messages/messages.theme";
import {SocietyMessagesApp} from "../../../apps/society-messages/components/SocietyMessagesApp";
import PhotoApp from "../../../apps/photo/components/PhotoApp";
import {ZutomApp} from "../../../apps/zutom/ZutomApp";
import {TwitchNewsApp} from "../../../apps/twitch-news/components/TwitchNewsApp";

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
    Icon?: React.FC<any>;
};

export const APPS: IAppConfig[] = [
    {
        id: 'DIALER',
        nameLocale: 'APPS_DIALER',
        color: DIALER_APP_TEXT_COLOR,
        path: '/phone',
        home: true,
        Route: () => <AppRoute path="/phone" component={DialerApp} />,
    },
    {
        id: 'MESSAGES',
        nameLocale: 'APPS_MESSAGES',
        color: MESSAGES_APP_TEXT_COLOR,
        path: '/messages',
        home: true,
        Route: () => (
            <AppRoute path="/messages" component={MessagesApp} />
        ),
    },
    {
        id: 'CONTACTS',
        nameLocale: 'APPS_CONTACTS',
        color: CONTACTS_APP_TEXT_COLOR,
        path: '/contacts',
        home: true,
        Route: () => (
            <AppRoute path="/contacts" component={ContactsApp} />
        ),
    },
    {
        id: 'BANK',
        nameLocale: 'APPS_BANK',
        color: 'common.white',
        path: '/bank',
        Route: () => <AppRoute path="/bank" component={BankApp} />,
    },
    {
        id: 'NOTES',
        nameLocale: 'APPS_NOTES',
        color: NOTES_APP_ICON_COLOR,
        path: '/notes',
        Route: () => <AppRoute path="/notes" component={NotesApp} />,
    },
    {
        id: 'SOCIETY_CONTACTS',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        color: SOCIETY_CONTACTS_APP_TEXT_COLOR,
        path: '/society-contacts',
        Route: () => (
            <AppRoute path="/society-contacts" component={SocietyContactsApp} />
        ),
    },
    {
        id: 'PHOTO',
        nameLocale: 'APPS_PHOTO',
        color: 'common.white',
        path: '/photo',
        Route: () => <AppRoute path="/photo" component={PhotoApp} />,
    },
    {
        id: 'SETTINGS',
        nameLocale: 'APPS_SETTINGS',
        color: 'grey[50]',
        path: '/settings',
        Route: () => (
            <AppRoute path="/settings" component={SettingsApp} />
        ),
    },
    {
        id: 'SOCIETY_MESSAGES',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/society-messages',
        Route: () => (
            <AppRoute path="/society-messages" component={SocietyMessagesApp} />
        ),
    },
    {
        id: 'TWITCH_NEWS',
        nameLocale: 'APPS_TWITCH_NEWS',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/twitch-news',
        Route: () => (
            <AppRoute path="/twitch-news" component={TwitchNewsApp} />
        ),
    },
    {
        id: 'ZUTOM',
        nameLocale: 'APPS_ZUTOM',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/zutom',
        Route: () => (
            <AppRoute path="/zutom" component={ZutomApp} />
        ),
    },
    /*{
      id: 'MARKETPLACE',
      nameLocale: 'APPS_MARKETPLACE',
      color: MARKETPLACE_APP_ICON_COLOR,
      path: '/marketplace',
      Route: () => (
        <AppRoute path="/marketplace" component={MarketplaceApp} emitOnOpen={false} />
      ),
    },*/
    {
        id: 'CAMERA',
        nameLocale: 'APPS_CAMERA',
        color: 'common.white',
        path: '/camera',
        home: true,
        Route: () => <AppRoute path="/camera" component={CameraApp} />,
    },
];
