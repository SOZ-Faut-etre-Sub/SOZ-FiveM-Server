import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../../store';
import { useDeathReason, useLsmcCalled } from '../emergency.atom';

export const LSMCButton = () => {
    const [lsmcCalled, setLsmcCalled] = useLsmcCalled();
    const deathReason = useDeathReason();

    const whatIf2Enabled = useSelector((state: RootState) => state.features.WhatIfSecondEpisode);

    const isDead = Boolean(deathReason?.length);

    const handleCallLSMC = () => {
        setLsmcCalled(true);
        fetchNui(NuiEvent.PhoneEmergencyCallLSMC);
    };

    if (whatIf2Enabled) {
        return null;
    }

    if (lsmcCalled) {
        return (
            <div className="text-gray-900 text-center w-4/5 rounded-2xl p-4 bg-gray-300">Alerte envoyée au LSMC</div>
        );
    }

    return (
        <div
            className="text-white text-center w-4/5 rounded-2xl p-4 bg-green-500 cursor-pointer"
            onClick={handleCallLSMC}
        >
            {!isDead ? 'Signaler une urgence' : 'Signaler un décès'}
        </div>
    );
};
