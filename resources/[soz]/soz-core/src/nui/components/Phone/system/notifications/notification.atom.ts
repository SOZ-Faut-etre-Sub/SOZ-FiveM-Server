import { atom } from 'jotai';

import { INotification } from './notification.types';

export const drawerOpenAtom = atom<boolean>(false);

export const notificationsAtom = atom<Array<INotification>>([]);
export const lastNotificationAtom = atom<string | null>(get => get(notificationsAtom)[0]?.id || null);
