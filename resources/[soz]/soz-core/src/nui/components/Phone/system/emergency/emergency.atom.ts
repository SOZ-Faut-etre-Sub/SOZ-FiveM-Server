import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useNuiEvent } from '../../../../hook/nui';

const emergencyAtom = atom<boolean>(false);
const deathReasonAtom = atom<string>('');

const lsmcCalledAtom = atom<boolean>(false);
const emergencyStartAtom = atom<Date | null>();

export const useEmergency = () => useAtomValue(emergencyAtom);
export const useDeathReason = () => useAtomValue(deathReasonAtom);
export const useLsmcCalled = () => useAtom(lsmcCalledAtom);
export const useEmergencyStart = () => useAtomValue(emergencyStartAtom);

export const useEmergencyStateHandlers = () => {
    const setEmergency = useSetAtom(emergencyAtom);
    const setDeathReason = useSetAtom(deathReasonAtom);
    const setLsmcCalled = useSetAtom(lsmcCalledAtom);
    const setEmergencyStart = useSetAtom(emergencyStartAtom);

    useNuiEvent('phone', 'SetEmergency', state => {
        setEmergency(state);

        if (state) {
            setLsmcCalled(false);
            setEmergencyStart(new Date());
        } else {
            setEmergency(state);
        }
    });
    useNuiEvent('phone', 'SetEmergencyDeath', setDeathReason);
};
