import { MicrophoneIcon, PhoneIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React, { Fragment, FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

import { store } from '../../../store';
import { EndCallIcon } from '../../../ui/assets/endCall';
import { useCall } from '../hooks/useCall';

export const CallControls: FunctionComponent = () => {
    const navigate = useNavigate();
    const { call, endCall, acceptCall, rejectCall, muteCall } = useCall();

    const callInProgress = call?.is_accepted || call?.isTransmitter;

    const handleAcceptCall = e => {
        e.stopPropagation();
        navigate('/call');
        acceptCall();
    };

    const handleRejectCall = e => {
        e.stopPropagation();
        store.dispatch.phone.setCallModal(false);
        rejectCall();
    };

    const handleEndCall = e => {
        e.stopPropagation();
        store.dispatch.phone.setCallModal(false);
        endCall();
    };

    const handleMuteCall = e => {
        e.stopPropagation();
        const muted = !call.muted;

        store.dispatch.simCard.setCallMute(muted);
        muteCall(muted);
    };

    return (
        <div className="absolute bottom-40 inset-x-0 flex justify-around">
            {callInProgress ? (
                <Fragment>
                    <EndCallIcon
                        className="h-20 w-20 text-white p-4 bg-red-500 rounded-full cursor-pointer"
                        onClick={handleEndCall}
                    />
                    <MicrophoneIcon
                        className={cn('h-20 w-20 bg-[#ededed] p-4 rounded-full cursor-pointer', {
                            'text-red-500': call.muted,
                            'text-ios-700': !call.muted,
                        })}
                        onClick={handleMuteCall}
                    />
                </Fragment>
            ) : (
                <Fragment>
                    <EndCallIcon
                        className="h-20 w-20 text-white p-4 bg-red-500 rounded-full cursor-pointer"
                        onClick={handleRejectCall}
                    />
                    <PhoneIcon
                        className="h-20 w-20 text-white p-4 bg-green-500 rounded-full cursor-pointer"
                        onClick={handleAcceptCall}
                    />
                </Fragment>
            )}
        </div>
    );
};
