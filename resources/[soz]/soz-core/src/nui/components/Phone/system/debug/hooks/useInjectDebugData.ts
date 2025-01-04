import { useDispatch } from 'react-redux';

import { Dispatch } from '../../../../../store';
import { isEnvBrowser } from '../utils/browser';

export const useInjectDebugData = (callback: () => void) => {
    const dispatch = useDispatch<Dispatch>();

    if (!isEnvBrowser()) {
        return;
    }

    dispatch.api.set({
        publicEndpoint: 'http://localhost',
    });

    callback();
};
