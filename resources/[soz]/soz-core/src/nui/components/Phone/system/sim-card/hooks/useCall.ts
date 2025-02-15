import { useAtomValue } from 'jotai';

import { callHistoryAtom, currentCallAtom } from '../sim.card.atom';

export const useCall = () => {
    const calls = useAtomValue(callHistoryAtom);
    const currentCall = useAtomValue(currentCallAtom);

    return {
        calls,
        currentCall,
    };
};
