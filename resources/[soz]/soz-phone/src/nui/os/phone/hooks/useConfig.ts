import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { getResourceName, isEnvBrowser } from '../../../utils/misc';
import { phoneState } from './state';

export const useConfig = (): void => {
    const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);

    useEffect(() => {
        if (isEnvBrowser()) return;
        const resourceName = getResourceName();
        fetch(`https://cfx-nui-${resourceName}/config.json`).then(async res => {
            const config = await res.json();
            setResourceConfig(config);
        });
    }, [setResourceConfig]);
};
