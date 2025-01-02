import { format } from 'date-fns';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { useNuiEvent } from '../../../hook/nui';
import { useInjectDebugData } from './debug/hooks/useInjectDebugData';

const phoneAvailableAtom = atom<boolean>(true);
const phoneTimeAtom = atom<string>('00:00');

const phoneVisibilityAtom = atom<boolean>(false);
const phoneNotificationVisibilityAtom = atom<boolean>(false);

export const usePhoneAvailable = () => useAtomValue(phoneAvailableAtom);
export const usePhoneTime = () => useAtomValue(phoneTimeAtom);

export const usePhoneVisibility = () => useAtomValue(phoneVisibilityAtom);
export const usePhoneNotificationVisibility = () => useAtomValue(phoneNotificationVisibilityAtom);

export const usePhoneStateHandlers = () => {
    const setPhoneAvailable = useSetAtom(phoneAvailableAtom);
    const setPhoneTime = useSetAtom(phoneTimeAtom);
    const setPhoneVisibility = useSetAtom(phoneVisibilityAtom);

    useNuiEvent('phone', 'SetAvailability', data => {
        setPhoneAvailable(data);
    });

    useNuiEvent('phone', 'SetTime', data => {
        setPhoneTime(data);
    });

    useNuiEvent('phone', 'SetVisibility', data => {
        setPhoneVisibility(data);
    });

    useInjectDebugData(() => {
        setPhoneAvailable(true);
        setPhoneTime(format(new Date(), 'HH:mm'));

        setPhoneVisibility(true);
    });
};
