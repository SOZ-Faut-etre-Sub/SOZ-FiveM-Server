import { useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { alertEndTimestampAtom, alertInProgressAtom } from '../weather.atom';

export const useWeatherAlert = () => {
    const alertEndTime = useAtomValue(alertEndTimestampAtom);
    const alertInProgress = useAtomValue(alertInProgressAtom);
    const refreshAlertInProgress = useSetAtom(alertInProgressAtom);

    return {
        alertEndTime,
        alertInProgress,
        refreshAlertInProgress,
    };
};
