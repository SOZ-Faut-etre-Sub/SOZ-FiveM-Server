import { IAppConfig } from '../../../../../shared/phone/app';
import CameraIcon from '../../apps/camera/icon';
import ContactsIcon from '../../apps/contacts/icon';
import DarkWebIcon from '../../apps/darkweb/icon';
import DialerIcon from '../../apps/dialer/icon';
import MessagesIcon from '../../apps/messages/icon';
import NotesIcon from '../../apps/notes/icon';
import { NotesApp } from '../../apps/notes/NotesApp';
import PhotosIcon from '../../apps/photos/icon';
import SettingsIcon from '../../apps/settings/icon';
import { SettingsApp } from '../../apps/settings/SettingsApp';
import WeatherIcon from '../../apps/weather/icon';

export const APPS: Array<IAppConfig> = [
    /* System apps */
    {
        id: 'dialer',
        nameLocale: 'APPS_DIALER',
        path: '/phone',
        home: true,
        icon: DialerIcon,
        // component: <DialerApp />,
    },
    {
        id: 'messages',
        nameLocale: 'APPS_MESSAGES',
        path: '/messages',
        home: true,
        icon: MessagesIcon,
        // component: <MessagesApp />,
    },
    {
        id: 'contacts',
        nameLocale: 'APPS_CONTACTS',
        path: '/contacts',
        home: true,
        icon: ContactsIcon,
        // component: <ContactsApp />,
    },
    {
        id: 'settings',
        nameLocale: 'APPS_SETTINGS',
        path: '/settings',
        icon: SettingsIcon,
        component: <SettingsApp />,
    },
    /* Other apps */
    {
        id: 'bank',
        nameLocale: 'APPS_BANK',
        path: '/bank',
        // icon: BankIcon,
        // component: <BankApp />,
    },
    {
        id: 'notes',
        nameLocale: 'APPS_NOTES',
        path: '/notes',
        icon: NotesIcon,
        component: <NotesApp />,
    },
    {
        id: 'society-contacts',
        nameLocale: 'APPS_SOCIETY_CONTACTS',
        path: '/society-contacts',
        // icon: SocietyContactIcon,
        // component: <SocietyContactsApp />,
    },
    {
        id: 'photos',
        nameLocale: 'APPS_PHOTO',
        path: '/photos',
        icon: PhotosIcon,
        // component: <PhotosApp />,
    },

    {
        id: 'society-messages',
        nameLocale: 'APPS_SOCIETY_MESSAGES',
        path: '/society-messages',
        // icon: SocietyMessagesIcon,
        // component: <SocietyMessagesApp />,
    },
    {
        id: 'twitch-news',
        nameLocale: 'APPS_TWITCH_NEWS',
        path: '/twitch-news',
        // icon: TwitchNewsIcon,
        // component: <TwitchNewsApp />,
    },
    /*
    Disabled as sutom web site no longer allow external inclusion
    Need a local instance to fix
    {
        id: 'zutom',
        nameLocale: 'APPS_ZUTOM',
        path: '/zutom',
        icon: ZutomIcon,
        component: <ZutomApp />,
    },
    */
    {
        id: 'camera',
        nameLocale: 'APPS_CAMERA',
        path: '/camera',
        home: true,
        icon: CameraIcon,
        // component: <CameraApp />,
    },
    {
        id: 'weather',
        nameLocale: 'APPS_WEATHER',
        path: '/weather',
        icon: WeatherIcon,
        // component: <WeatherApp />,
    },
    {
        id: 'game-tetris',
        nameLocale: 'APPS_TETRIS',
        path: '/game-tetris',
        // icon: GameTetrisIcon,
        // component: <GameTetris />,
    },
    {
        id: 'snake',
        nameLocale: 'APPS_SNAKE',
        path: '/snake',
        // icon: SnakeIcon,
        // component: <SnakeApp />,
    },
    {
        id: 'darkweb',
        nameLocale: 'APPS_DARKWEB',
        path: '/darkweb',
        icon: DarkWebIcon,
        // component: <DarkWebApp />,
        requiredItems: ['vpn'],
    },
    {
        id: 'tax',
        nameLocale: 'APPS_TAX',
        path: '/tax',
        // icon: TaxIcon,
        // component: <TaxApp />,
    },
];
