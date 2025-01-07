import { format } from 'date-fns';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { useNuiEvent } from '../../../hook/nui';
import { useInjectDebugData } from './debug/hooks/useInjectDebugData';

const phoneAvailableAtom = atom<boolean>(true);

const phoneTimeHoursAtom = atom<number>(0);
const phoneTimeMinutesAtom = atom<number>(0);
const phoneTimeAtom = atom<string>(
    get => `${String(get(phoneTimeHoursAtom)).padStart(2, '0')}:${String(get(phoneTimeMinutesAtom)).padStart(2, '0')}`
);
const phoneTimeIsDayAtom = atom<boolean>(get => get(phoneTimeHoursAtom) >= 6 && get(phoneTimeHoursAtom) < 21);

const phoneVisibilityAtom = atom<boolean>(false);
const phoneNotificationVisibilityAtom = atom<boolean>(false);

export const usePhoneAvailable = () => useAtomValue(phoneAvailableAtom);
export const usePhoneTime = () => useAtomValue(phoneTimeAtom);
export const usePhoneTimeIsDay = () => useAtomValue(phoneTimeIsDayAtom);

export const usePhoneVisibility = () => useAtomValue(phoneVisibilityAtom);
export const usePhoneNotificationVisibility = () => useAtomValue(phoneNotificationVisibilityAtom);

export const usePhoneStateHandlers = () => {
    const setPhoneAvailable = useSetAtom(phoneAvailableAtom);
    const setPhoneVisibility = useSetAtom(phoneVisibilityAtom);

    const setPhoneTimeHours = useSetAtom(phoneTimeHoursAtom);
    const setPhoneTimeMinutes = useSetAtom(phoneTimeMinutesAtom);

    useNuiEvent('phone', 'SetAvailability', setPhoneAvailable);
    useNuiEvent('phone', 'SetTime', data => {
        setPhoneTimeHours(data.hour);
        setPhoneTimeMinutes(data.minute);
    });

    useNuiEvent('phone', 'SetVisibility', setPhoneVisibility);

    useInjectDebugData(() => {
        setPhoneAvailable(true);

        const date = new Date();
        setPhoneTimeHours(date.getHours());
        setPhoneTimeMinutes(date.getMinutes());

        setPhoneVisibility(true);
    });
};
