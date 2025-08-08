import { SOZ_CORE_IS_PRODUCTION } from '@public/globals';
import { fetchNui } from '@public/nui/fetch';
import { useInterval } from '@public/nui/hook/useInterval';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { RootState } from '../../../../../store';
import { useEmergencyStart } from '../emergency.atom';

const timeBeforeUHUAvailable = SOZ_CORE_IS_PRODUCTION ? 900000 : 20000;
const timeBeforeUHUAvailableWhatIf = SOZ_CORE_IS_PRODUCTION ? 600000 : 20000;

export const UHUButton = () => {
    const start = useEmergencyStart();

    const whatIf2Enabled = useSelector((state: RootState) => state.features.WhatIfSecondEpisode);

    const [, forceRender] = useState<number>(0);

    const handleCallUHU = () => {
        fetchNui(NuiEvent.PhoneEmergencyCallUHU);
    };

    useInterval(() => {
        forceRender(prev => prev + 1);
    }, 5000);

    const UHUAvailableAt = start.getTime() + (whatIf2Enabled ? timeBeforeUHUAvailableWhatIf : timeBeforeUHUAvailable);
    const UHUAvailable = Date.now() > UHUAvailableAt;

    if (UHUAvailable) {
        return (
            <div
                className="text-xl text-white text-center w-4/5 rounded-2xl p-4 bg-red-500 cursor-pointer"
                onClick={handleCallUHU}
            >
                Demande d'UHU
            </div>
        );
    }

    return (
        <div
            style={{ lineHeight: '2rem' }}
            className="text-1xl text-gray-500 text-center w-4/5 rounded-2xl p-4 bg-gray-300"
        >
            UHU disponible dans {formatDistanceToNow(UHUAvailableAt, { includeSeconds: true, locale: fr })}
        </div>
    );
};
