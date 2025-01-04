import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const enabledAtom = atom(false);

export const useDarkWebEnabled = () => useAtomValue(enabledAtom);

export const useAppDarkWebStateHandlers = () => {
    const setEnabled = useSetAtom(enabledAtom);

    useInjectDebugData(() => {
        setEnabled(true);
    });
};
