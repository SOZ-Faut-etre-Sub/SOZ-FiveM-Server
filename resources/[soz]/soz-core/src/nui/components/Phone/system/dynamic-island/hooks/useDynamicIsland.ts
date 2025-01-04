import { useAtom } from 'jotai';

import { DynamicIslandData } from '../../../../../../shared/phone/app';
import { dynamicIslandDataAtom } from '../dynamic-island.atom';

export const useDynamicIsland = () => {
    const [data, setData] = useAtom(dynamicIslandDataAtom);

    const sendIsland = (type: DynamicIslandData['type']) => {
        setData({ type });
    };

    const reset = () => {
        setData(null);
    };

    return {
        data,
        sendIsland,
        reset,
    };
};
