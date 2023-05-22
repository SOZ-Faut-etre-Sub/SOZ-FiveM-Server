import React from 'react';

import { useContact } from '../../../hooks/useContact';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useCall } from '../hooks/useCall';

const CallContactContainer = () => {
    const { call } = useCall();

    const { getDisplayByNumber, getPictureByNumber } = useContact();
    let displayNumber = false;

    const getDisplayOrNumber = () => {
        const numberToCheck = call.isTransmitter ? call?.receiver : call?.transmitter;
        displayNumber = numberToCheck == getDisplayByNumber(numberToCheck) ? false : true;
        return getDisplayByNumber(numberToCheck);
    }
       
    return (
        <div className="flex flex-col justify-center items-center mt-24 text-white">
            <ContactPicture
                size={'large'}
                picture={call.isTransmitter ? getPictureByNumber(call.receiver) : getPictureByNumber(call?.transmitter)}
            />
            <div className="text-3xl font-light max-w-[90%] truncate">{getDisplayOrNumber()}</div>
            {displayNumber ? <p>{call.isTransmitter ? call.receiver : call?.transmitter}</p> : null}
        </div>
    );
};

export default CallContactContainer;
