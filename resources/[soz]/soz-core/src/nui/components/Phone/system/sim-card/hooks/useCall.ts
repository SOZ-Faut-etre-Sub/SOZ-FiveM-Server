import { useAtomValue } from 'jotai';

import { callHistoryAtom, callModalOpenAtom, currentCallAtom } from '../sim.card.atom';

export const useCall = () => {
    const currentCall = useAtomValue(currentCallAtom);
    const calls = useAtomValue(callHistoryAtom);
    const callModalOpen = useAtomValue(callModalOpenAtom);

    return {
        calls,
        currentCall,
        callModalOpen,
    };
};
