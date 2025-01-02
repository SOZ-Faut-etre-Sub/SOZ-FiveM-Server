import { atom, useAtomValue } from 'jotai';

const emergencyAtom = atom<boolean>(false);
const emergencyStartAtom = atom<Date | null>(null);

const lsmcCalledAtom = atom<boolean>(false);
const deathReasonAtom = atom<string>('');

export const useEmergency = () => useAtomValue(emergencyAtom);
