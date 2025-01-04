import { useAtomValue, useSetAtom } from 'jotai';
import { atom } from 'jotai/index';

import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../debug/hooks/useInjectDebugData';
import { ActiveCall } from './sim.types';

export const numberAtom = atom<string>('');
export const societyNumberAtom = atom<string>();

export const avatarAtom = atom<string>();

const callModalOpenAtom = atom<boolean>(false);
export const currentCallAtom = atom<ActiveCall | null>(null);

export const callHistoryAtom = atom<string[]>([]);
export const contactsAtom = atom<string[]>([]);

export const conversationsAtom = atom<string[]>([]);
export const messagesAtom = atom<string[]>([]);

export const useCallModalOpen = () => useAtomValue(callModalOpenAtom);
export const useSetCallModalOpen = () => useSetAtom(callModalOpenAtom);

export const useSimCardStateHandlers = () => {
    const setNumber = useSetAtom(numberAtom);
    const setAvatar = useSetAtom(avatarAtom);
    const setSocietyNumber = useSetAtom(societyNumberAtom);

    useNuiEvent('phone', 'SetSimCard', setNumber);
    useNuiEvent('phone', 'SetSimCardAvatar', setAvatar);

    useNuiEvent('phone', 'SetSocietySimCard', setSocietyNumber);

    // SET_AVATAR

    useInjectDebugData(() => {
        setNumber('555-5555');
        setSocietyNumber('555-FBI');
    });
};
