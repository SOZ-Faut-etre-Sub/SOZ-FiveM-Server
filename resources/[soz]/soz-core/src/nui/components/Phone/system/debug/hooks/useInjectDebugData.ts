import { SOZ_CORE_IS_PRODUCTION } from '../../../../../../globals';

export const useInjectDebugData = (callback: () => void) => {
    if (SOZ_CORE_IS_PRODUCTION) {
        return;
    }

    callback();
};
