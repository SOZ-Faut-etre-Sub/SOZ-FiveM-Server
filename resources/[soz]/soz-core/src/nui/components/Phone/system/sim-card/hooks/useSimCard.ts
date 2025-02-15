import { useAtomValue } from 'jotai';

import { numberAtom } from '../sim.card.atom';

export const useSimCard = () => {
    const number = useAtomValue(numberAtom);

    return {
        number,
    };
};
