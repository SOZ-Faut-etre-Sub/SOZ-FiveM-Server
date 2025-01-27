import { useAtomValue } from 'jotai';

import { callHistoryAtom, callModalOpenAtom, currentCallAtom } from '../sim.card.atom';
import { useSimCard } from './useSimCard';

export const useCall = () => {
    const { number } = useSimCard();

    const calls = useAtomValue(callHistoryAtom);
    const currentCall = useAtomValue(currentCallAtom);
    const callModalOpen = useAtomValue(callModalOpenAtom);

    const isTransmitter = currentCall?.transmitter === number;

    return {
        calls,
        currentCall,
        callModalOpen,
        isTransmitter,
    };
};
