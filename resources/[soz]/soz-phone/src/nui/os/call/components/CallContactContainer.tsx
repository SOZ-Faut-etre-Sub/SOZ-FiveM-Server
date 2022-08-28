import React from 'react';

import { useContact } from '../../../hooks/useContact';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useCall } from '../hooks/useCall';

const CallContactContainer = () => {
    const { call } = useCall();

    const { getDisplayByNumber, getPictureByNumber } = useContact();

    const getDisplayOrNumber = () =>
        call.isTransmitter ? getDisplayByNumber(call?.receiver) : getDisplayByNumber(call?.transmitter);

    return (
        <div className="flex flex-col justify-center items-center mt-24 text-white">
            <ContactPicture
                size={'large'}
                picture={call.isTransmitter ? getPictureByNumber(call.receiver) : getPictureByNumber(call?.transmitter)}
            />
            <div className="text-3xl font-light max-w-[90%] truncate">{getDisplayOrNumber()}</div>
        </div>
    );
};

export default CallContactContainer;
