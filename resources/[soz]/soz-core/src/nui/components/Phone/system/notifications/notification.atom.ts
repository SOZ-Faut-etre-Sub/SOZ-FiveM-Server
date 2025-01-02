import { atom } from 'jotai';

import { INotification } from './notification.types';

export const drawerOpenAtom = atom<boolean>(false);

export const notificationsAtom = atom<Array<INotification>>([]);
