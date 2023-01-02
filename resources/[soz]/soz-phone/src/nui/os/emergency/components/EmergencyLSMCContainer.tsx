import React, { Fragment, FunctionComponent } from 'react';

import { useLSMCCalled } from '../../../hooks/useEmergency';
import { store } from '../../../store';
import { useEmergency } from '../hooks/useEmergency';

const EmergencyLSMCContainer: FunctionComponent = () => {
    const emergency = useEmergency();
    const lsmcCalled = useLSMCCalled();

    const handleCallLSMC = e => {
        e.stopPropagation();
        store.dispatch.emergency.setLSMCCalled(true);
        emergency.lsmcCall();
    };

    return (
        <div className="text-2xl mt-5 inset-x-0 flex justify-around">
            <Fragment>
                {!lsmcCalled ? (
                    <div
                        className="text-white text-center w-4/5 rounded-2xl p-4 bg-green-500 cursor-pointer h-16"
                        onClick={handleCallLSMC}
                    >
                        Signaler une urgence
                    </div>
                ) : (
                    <div className="text-gray-900 text-center w-4/5 rounded-2xl p-4 bg-gray-300 h-16">
                        Alerte envoyée au LSMC
                    </div>
                )}
            </Fragment>
        </div>
    );
};

export default EmergencyLSMCContainer;
