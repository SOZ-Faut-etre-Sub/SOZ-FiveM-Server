import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { societyNumberAtom } from '../sim.card.atom';

export const useSocietySimCard = () => {
    const societyNumber = useAtomValue(societyNumberAtom);

    const canUseDynamicAlerts = useMemo(() => {
        return ['555-LSPD', '555-BCSO', '555-SASP', '555-FBI', '555-LSCS'].some(
            allowedNumber => allowedNumber === societyNumber
        );
    }, [societyNumber]);

    return {
        societyNumber,
        canUseDynamicAlerts,
    };
};
