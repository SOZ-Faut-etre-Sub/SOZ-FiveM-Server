import { EmergencyEvents } from '@typings/emergency';
import { useCallback } from 'react';

import { fetchNui } from '../../../utils/fetchNui';

interface EmergencyHook {
    lsmcCall(): void;
    XCall(): void;
}

export const useEmergency = (): EmergencyHook => {
    const lsmcCall = useCallback(() => {
        fetchNui(EmergencyEvents.LSMC_CALL, null, {});
    }, []);

    const XCall = useCallback(() => {
        fetchNui(EmergencyEvents.UNITEX_CALL, null, {});
    }, []);

    return { lsmcCall, XCall };
};
