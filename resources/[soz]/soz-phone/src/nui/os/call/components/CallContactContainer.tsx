import React from 'react';

import { useContact } from '../../../hooks/useContact';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useCall } from '../hooks/useCall';

const CallContactContainer = () => {
    const { call } = useCall();

    const { getDisplayByNumber, getPictureByNumber } = useContact();

    const remoteNumber = call.isTransmitter ? call?.receiver : call?.transmitter;
    const shouldDisplayNumber = remoteNumber != getDisplayByNumber(remoteNumber);

    return (
        <div className="flex flex-col justify-center items-center mt-24 text-white">
            <ContactPicture
                size={'large'}
                picture={call.isTransmitter ? getPictureByNumber(call.receiver) : getPictureByNumber(call?.transmitter)}
            />
            <div className="text-3xl font-light max-w-[90%] truncate">{getDisplayByNumber(remoteNumber)}</div>
            {shouldDisplayNumber && <p>{remoteNumber}</p>}
        </div>
    );
};

export default CallContactContainer;
