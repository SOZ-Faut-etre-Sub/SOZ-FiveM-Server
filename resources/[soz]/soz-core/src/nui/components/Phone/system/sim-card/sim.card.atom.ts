import { useAtomValue, useSetAtom } from 'jotai';
import { atom } from 'jotai/index';

import { ActiveCall } from './sim.types';

export const numberAtom = atom<string>('');
export const societyNumberAtom = atom<string>('');

export const avatarAtom = atom<string | null>(null);

const callModalOpenAtom = atom<boolean>(false);
export const currentCallAtom = atom<ActiveCall | null>(null);

export const callHistoryAtom = atom<string[]>([]);
export const contactsAtom = atom<string[]>([]);

export const conversationsAtom = atom<string[]>([]);
export const messagesAtom = atom<string[]>([]);

export const useCallModalOpen = () => useAtomValue(callModalOpenAtom);
export const useSetCallModalOpen = () => useSetAtom(callModalOpenAtom);

export const useSimCardStateHandlers = () => {
    // SET_AVATAR
};
