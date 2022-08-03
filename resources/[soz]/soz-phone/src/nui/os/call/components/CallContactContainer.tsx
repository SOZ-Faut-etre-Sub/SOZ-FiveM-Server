import React from 'react';

import { useContact } from '../../../hooks/useContact';
import { useCall } from '../hooks/useCall';

const CallContactContainer = () => {
    const { call } = useCall();

    const { getDisplayByNumber, getPictureByNumber } = useContact();

    const getDisplayOrNumber = () =>
        call.isTransmitter ? getDisplayByNumber(call?.receiver) : getDisplayByNumber(call?.transmitter);

    return (
        <div className="flex flex-col justify-center items-center mt-24 text-white">
            <div
                className="bg-cover bg-center h-20 w-20 my-1 rounded-full"
                style={{
                    backgroundImage: `url(${
                        call.isTransmitter ? getPictureByNumber(call.receiver) : getPictureByNumber(call?.transmitter)
                    })`,
                }}
            />
            <div className="text-3xl font-light max-w-[90%] truncate">{getDisplayOrNumber()}</div>
        </div>
    );
};

export default CallContactContainer;
