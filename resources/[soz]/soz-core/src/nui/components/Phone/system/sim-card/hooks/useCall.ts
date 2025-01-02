import { useAtomValue } from 'jotai';

import { currentCallAtom } from '../sim.card.atom';

export const useCall = () => {
    const currentCall = useAtomValue(currentCallAtom);

    return {
        currentCall,
    };
};
