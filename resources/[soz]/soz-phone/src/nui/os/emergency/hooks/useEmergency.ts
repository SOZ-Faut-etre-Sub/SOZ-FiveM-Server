import { EmergencyEvents } from '@typings/emergency';
import { useCallback } from 'react';

import { fetchNui } from '../../../utils/fetchNui';

interface EmergencyHook {
    lsmcCall(): void;
    UHUCall(): void;
}

export const useEmergency = (): EmergencyHook => {
    const lsmcCall = useCallback(() => {
        fetchNui(EmergencyEvents.LSMC_CALL, null, {});
    }, []);

    const UHUCall = useCallback(() => {
        fetchNui(EmergencyEvents.UHU_CALL, null, {});
    }, []);

    return { lsmcCall, UHUCall };
};
