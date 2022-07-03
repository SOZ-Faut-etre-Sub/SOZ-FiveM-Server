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
import BankIcon from '../icons/app/BANK';
import CameraIcon from '../icons/app/CAMERA';
import ContactIcon from '../icons/app/CONTACTS';
import DialerIcon from '../icons/app/DIALER';
import MessagesIcon from '../icons/app/MESSAGES';
import NotesIcon from '../icons/app/NOTES';
import PhotoIcon from '../icons/app/PHOTO';
import SettingsIcon from '../icons/app/SETTINGS';
import SocietyContactIcon from '../icons/app/SOCIETY_CONTACTS';
import SocietyMessagesIcon from '../icons/app/SOCIETY_MESSAGES';
import TwitchNewsIcon from '../icons/app/TWITCH_NEWS';
import ZutomIcon from '../icons/app/ZUTOM';

export interface IAppConfig {
    id: string;
    nameLocale: string;
    color: string;
    path: string;
    home?: boolean;
    Icon: React.FC;
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
        Icon: DialerIcon,
        Route: () => <AppRoute path="/phone" component={DialerApp} />,
    },
    {
        id: 'MESSAGES',
        nameLocale: 'APPS_MESSAGES',
        color: MESSAGES_APP_TEXT_COLOR,
        path: '/messages',
        home: true,
        Icon: MessagesIcon,
        Route: () => <AppRoute path="/messages" component={MessagesApp} />,
    },
    {
        id: 'CONTACTS',
        nameLocale: 'APPS_CONTACTS',
        color: CONTACTS_APP_TEXT_COLOR,
        path: '/contacts',
        home: true,
        Icon: ContactIcon,
        Route: () => <AppRoute path="/contacts" component={ContactsApp} />,
    },
    {
        id: 'BANK',
        nameLocale: 'APPS_BANK',
        color: 'common.white',
        path: '/bank',
        Icon: BankIcon,
        Route: () => <AppRoute path="/bank" component={BankApp} />,
    },
    {
        id: 'NOTES',
        nameLocale: 'APPS_NOTES',
        color: NOTES_APP_ICON_COLOR,
        path: '/notes',
        Icon: NotesIcon,
        Route: () => <AppRoute path="/notes" component={NotesApp} />,
    },
    {
        id: 'SOCIETY_CONTACTS',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        color: SOCIETY_CONTACTS_APP_TEXT_COLOR,
        path: '/society-contacts',
        Icon: SocietyContactIcon,
        Route: () => <AppRoute path="/society-contacts" component={SocietyContactsApp} />,
    },
    {
        id: 'PHOTO',
        nameLocale: 'APPS_PHOTO',
        color: 'common.white',
        path: '/photo',
        Icon: PhotoIcon,
        Route: () => <AppRoute path="/photo" component={PhotoApp} />,
    },
    {
        id: 'SETTINGS',
        nameLocale: 'APPS_SETTINGS',
        color: 'grey[50]',
        path: '/settings',
        Icon: SettingsIcon,
        Route: () => <AppRoute path="/settings" component={SettingsApp} />,
    },
    {
        id: 'SOCIETY_MESSAGES',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/society-messages',
        Icon: SocietyMessagesIcon,
        Route: () => <AppRoute path="/society-messages" component={SocietyMessagesApp} />,
    },
    {
        id: 'TWITCH_NEWS',
        nameLocale: 'APPS_TWITCH_NEWS',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/twitch-news',
        Icon: TwitchNewsIcon,
        Route: () => <AppRoute path="/twitch-news" component={TwitchNewsApp} />,
    },
    {
        id: 'ZUTOM',
        nameLocale: 'APPS_ZUTOM',
        color: SOCIETY_MESSAGES_APP_TEXT_COLOR,
        path: '/zutom',
        Icon: ZutomIcon,
        Route: () => <AppRoute path="/zutom" component={ZutomApp} />,
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
        Icon: CameraIcon,
        Route: () => <AppRoute path="/camera" component={CameraApp} />,
    },
];
