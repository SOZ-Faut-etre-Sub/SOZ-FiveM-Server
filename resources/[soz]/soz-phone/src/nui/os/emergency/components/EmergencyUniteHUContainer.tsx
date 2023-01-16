import React, { Fragment, FunctionComponent, useState } from 'react';

import { SOZ_PHONE_IS_PRODUCTION } from '../../../../globals';
import { useEmergencyStart } from '../../../hooks/useEmergency';
import useInterval from '../../../hooks/useInterval';
import { useEmergency } from '../hooks/useEmergency';

const timeBeforeUHUAvailable = SOZ_PHONE_IS_PRODUCTION ? 900000 : 20000;

const EmergencyUniteHUContainer: FunctionComponent = () => {
    const emergencyHook = useEmergency();
    const start = useEmergencyStart();

    const handleCallUHU = e => {
        e.stopPropagation();
        emergencyHook.UHUCall();
    };

    const [timing, setDelta] = useState({
        delta: 0,
        minutes: Math.ceil((timeBeforeUHUAvailable - Date.now() + start) / 60000),
    });

    useInterval(() => {
        const delta = Date.now() - start;
        const minutes = Math.ceil((timeBeforeUHUAvailable - delta) / 60000);
        setDelta({ delta, minutes });
    }, 10000);

    return (
        <div className="mt-5  inset-x-0 flex justify-around">
            <Fragment>
                {timing.delta > timeBeforeUHUAvailable ? (
                    <div
                        className="text-2xl text-white text-center w-4/5 rounded-2xl p-4 bg-red-500 cursor-pointer h-16"
                        onClick={handleCallUHU}
                    >
                        Demande d'UHU
                    </div>
                ) : (
                    <div
                        style={{ lineHeight: '2rem' }}
                        className="text-1xl text-gray-500 text-center w-4/5 rounded-2xl p-4 bg-gray-300 h-16"
                    >
                        UHU disponible dans {timing.minutes} minute{timing.minutes > 1 ? 's' : ''}
                    </div>
                )}
            </Fragment>
        </div>
    );
};

export default EmergencyUniteHUContainer;
