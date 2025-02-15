import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { IAlert } from './alerts.types';

const alertAtom = atom<IAlert>();

export const useAlerts = () => useAtomValue(alertAtom);
export const useSetAlerts = () => useSetAtom(alertAtom);
