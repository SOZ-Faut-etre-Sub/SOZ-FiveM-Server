import { useMemo } from 'react';

import { IAppConfig } from '../../../../../../shared/phone/app';
import { BankApp } from '../../../apps/bank/BankApp';
import BankIcon from '../../../apps/bank/icon';
import { CameraApp } from '../../../apps/camera/CameraApp';
import CameraIcon from '../../../apps/camera/icon';
import { ContactsApp } from '../../../apps/contacts/ContactsApp';
import ContactsIcon from '../../../apps/contacts/icon';
import { useDarkWebEnabled } from '../../../apps/darkweb/darkweb.atom';
import { DarkWebApp } from '../../../apps/darkweb/DarkWebApp';
import DarkWebIcon from '../../../apps/darkweb/icon';
import { DialerApp } from '../../../apps/dialer/DialerApp';
import DialerIcon from '../../../apps/dialer/icon';
import MessagesIcon from '../../../apps/messages/icon';
import { MessagesApp } from '../../../apps/messages/MessagesApp';
import NewsIcon from '../../../apps/news/icon';
import { NewsApp } from '../../../apps/news/NewsApp';
import NotesIcon from '../../../apps/notes/icon';
import { NotesApp } from '../../../apps/notes/NotesApp';
import PhotosIcon from '../../../apps/photos/icon';
import { PhotosApp } from '../../../apps/photos/PhotosApp';
import SettingsIcon from '../../../apps/settings/icon';
import { SettingsApp } from '../../../apps/settings/SettingsApp';
import SnakeIcon from '../../../apps/snake/icon';
import { SnakeApp } from '../../../apps/snake/SnakeApp';
import SocietyContactsIcon from '../../../apps/society-contacts/icon';
import { SocietyContactsApp } from '../../../apps/society-contacts/SocietyContactsApp';
import { SocietyMessagesApp } from '../../../apps/society-messages/SocietyMessagesApp';
import { TaxApp } from '../../../apps/tax/TaxApp';
import TetrisIcon from '../../../apps/tetris/icon';
import { TetrisApp } from '../../../apps/tetris/TetrisApp';
import WeatherIcon from '../../../apps/weather/icon';
import { WeatherApp } from '../../../apps/weather/WeatherApp';
import ZutomIcon from '../../../apps/zutom/icon';
import { ZutomApp } from '../../../apps/zutom/ZutomApp';
import { useSocietySimCard } from '../../sim-card/hooks/useSocietySimCard';

export const useApps = () => {
    const { societyNumber } = useSocietySimCard();
    const darkWebAppEnabled = useDarkWebEnabled();

    const APPS: Array<IAppConfig> = [
        /* System apps */
        {
            id: 'dialer',
            nameLocale: 'APPS_DIALER',
            path: '/phone',
            icon: DialerIcon,
            component: <DialerApp />,
            position: 1,
            home: true,
        },
        {
            id: 'messages',
            nameLocale: 'APPS_MESSAGES',
            path: '/messages',
            icon: MessagesIcon,
            component: <MessagesApp />,
            position: 2,
            home: true,
        },
        {
            id: 'contacts',
            nameLocale: 'APPS_CONTACTS',
            path: '/contacts',
            icon: ContactsIcon,
            component: <ContactsApp />,
            position: 3,
            home: true,
        },
        {
            id: 'settings',
            nameLocale: 'APPS_SETTINGS',
            path: '/settings',
            icon: SettingsIcon,
            component: <SettingsApp />,
            position: 13,
        },
        {
            id: 'photos',
            nameLocale: 'APPS_PHOTO',
            path: '/photos',
            icon: PhotosIcon,
            component: <PhotosApp />,
            position: 3,
        },
        {
            id: 'camera',
            nameLocale: 'APPS_CAMERA',
            path: '/camera',
            icon: CameraIcon,
            component: <CameraApp />,
            position: 4,
            home: true,
        },

        /* Society apps */
        {
            id: 'society-contacts',
            nameLocale: 'APPS_SOCIETY_CONTACTS',
            path: '/society-contacts',
            icon: SocietyContactsIcon,
            component: <SocietyContactsApp />,
            position: 5,
        },
        {
            id: 'society-messages',
            nameLocale: 'APPS_SOCIETY_MESSAGES',
            path: '/society-messages',
            // icon: SocietyMessagesIcon,
            component: <SocietyMessagesApp />,
            condition: () => Boolean(societyNumber),
            position: 6,
        },
        {
            id: 'news',
            nameLocale: 'APPS_NEWS',
            path: '/news',
            icon: NewsIcon,
            component: <NewsApp />,
            position: 7,
        },

        /* Gang apps */
        {
            id: 'darkweb',
            nameLocale: 'APPS_DARKWEB',
            path: '/darkweb',
            icon: DarkWebIcon,
            component: <DarkWebApp />,
            condition: () => darkWebAppEnabled,
            position: 12,
        },

        /* Other apps */
        {
            id: 'bank',
            nameLocale: 'APPS_BANK',
            path: '/bank',
            icon: BankIcon,
            component: <BankApp />,
            position: 1,
        },
        {
            id: 'notes',
            nameLocale: 'APPS_NOTES',
            path: '/notes',
            icon: NotesIcon,
            component: <NotesApp />,
            position: 2,
        },
        {
            id: 'weather',
            nameLocale: 'APPS_WEATHER',
            path: '/weather',
            icon: WeatherIcon,
            component: <WeatherApp />,
            position: 4,
        },
        {
            id: 'tax',
            nameLocale: 'APPS_TAX',
            path: '/tax',
            // icon: TaxIcon,
            component: <TaxApp />,
            position: 8,
        },

        /* Games apps */
        {
            id: 'tetris',
            nameLocale: 'APPS_TETRIS',
            path: '/tetris',
            icon: TetrisIcon,
            component: <TetrisApp />,
            position: 10,
        },
        {
            id: 'snake',
            nameLocale: 'APPS_SNAKE',
            path: '/snake',
            icon: SnakeIcon,
            component: <SnakeApp />,
            position: 11,
        },
        {
            id: 'zutom',
            nameLocale: 'APPS_ZUTOM',
            path: '/zutom',
            icon: ZutomIcon,
            component: <ZutomApp />,
            position: 9,
        },
    ];

    return useMemo(() => {
        return APPS.filter(app => {
            if (app.condition) return app.condition();
            return true;
        });
    }, []);
};
