import { atom, useAtomValue, useSetAtom } from 'jotai';

import { useNuiEvent } from '../../../hook/nui';
import { useInjectDebugData } from './debug/hooks/useInjectDebugData';
import { flashLightAtomWithNui } from './phone.utils.atom';

const phoneAvailableAtom = atom<boolean>(true);
const phoneFreeCameraAtom = atom<boolean>(false);
const phoneInsideInputAtom = atom<boolean>(false);
const phoneForceDisableFocusAtom = atom<boolean>(false);

const phoneFocusAtom = atom<boolean>(get => {
    const phoneForceDisableFocus = get(phoneForceDisableFocusAtom);
    if (phoneForceDisableFocus) return false;

    const freeCamera = get(phoneFreeCameraAtom);
    if (freeCamera) return false;

    return get(phoneVisibilityAtom);
});

const phoneTimeHoursAtom = atom<number>(0);
const phoneTimeMinutesAtom = atom<number>(0);
const phoneTimeAtom = atom<string>(
    get => `${String(get(phoneTimeHoursAtom)).padStart(2, '0')}:${String(get(phoneTimeMinutesAtom)).padStart(2, '0')}`
);
const phoneTimeIsDayAtom = atom<boolean>(get => get(phoneTimeHoursAtom) >= 6 && get(phoneTimeHoursAtom) < 21);

const phoneVisibilityAtom = atom<boolean>(false);

const lastCursorPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });

export const usePhoneAvailable = () => useAtomValue(phoneAvailableAtom);
export const usePhoneTime = () => useAtomValue(phoneTimeAtom);
export const usePhoneTimeIsDay = () => useAtomValue(phoneTimeIsDayAtom);

export const usePhoneFocus = () => useAtomValue(phoneFocusAtom);
export const useSetPhoneFreeCamera = () => useSetAtom(phoneFreeCameraAtom);

export const usePhoneInsideInput = () => useAtomValue(phoneInsideInputAtom);
export const useSetPhoneInsideInput = () => useSetAtom(phoneInsideInputAtom);

export const usePhoneVisibility = () => useAtomValue(phoneVisibilityAtom);

export const useLastCursorPosition = () => useAtomValue(lastCursorPositionAtom);
export const useSetLastCursorPosition = () => useSetAtom(lastCursorPositionAtom);

export const usePhoneStateHandlers = () => {
    const setPhoneAvailable = useSetAtom(phoneAvailableAtom);
    const setPhoneVisibility = useSetAtom(phoneVisibilityAtom);
    const setPhoneFreeCamera = useSetAtom(phoneFreeCameraAtom);
    const setForceDisableFocus = useSetAtom(phoneForceDisableFocusAtom);

    const setPhoneFlashlight = useSetAtom(flashLightAtomWithNui);
    const setPhoneTimeHours = useSetAtom(phoneTimeHoursAtom);
    const setPhoneTimeMinutes = useSetAtom(phoneTimeMinutesAtom);

    useNuiEvent('phone', 'SetAvailability', setPhoneAvailable);
    useNuiEvent('phone', 'SetPhoneFreeCamera', setPhoneFreeCamera);
    useNuiEvent('phone', 'SetPhoneDisableFocus', setForceDisableFocus);
    useNuiEvent('phone', 'SetTime', data => {
        setPhoneTimeHours(data.hour);
        setPhoneTimeMinutes(data.minute);
    });

    useNuiEvent('phone', 'SetVisibility', visibility => {
        setPhoneVisibility(visibility);

        if (!visibility) {
            setPhoneFlashlight(false);
        }
    });

    useInjectDebugData(() => {
        setPhoneAvailable(true);

        const date = new Date();
        setPhoneTimeHours(date.getHours());
        setPhoneTimeMinutes(date.getMinutes());

        setPhoneVisibility(true);
    });
};
