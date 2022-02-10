import React from 'react';
import {useCall} from '../hooks/useCall';
import {useCallModal} from '../hooks/useCallModal';
import {useHistory} from 'react-router-dom';
import {PhoneIcon} from "@heroicons/react/solid";


export const CallControls = ({isSmall}: { isSmall?: boolean }) => {
    const history = useHistory();
    const {setModal} = useCallModal();
    const {call, endCall, acceptCall, rejectCall} = useCall();

    const handleAcceptCall = (e) => {
        e.stopPropagation();
        history.push('/call');
        acceptCall();
    };

    const handleRejectCall = (e) => {
        e.stopPropagation();
        setModal(false);
        rejectCall();
    };

    const handleEndCall = (e) => {
        e.stopPropagation();
        setModal(false);
        endCall();
    };

    // We display only the hang up if the call is accepted
    // or we are the one calling
    if (call?.is_accepted || call?.isTransmitter)
        return (
            <div className="absolute bottom-40 inset-x-0 flex justify-center">
                <PhoneIcon className="h-20 w-20 rotate-[140deg] text-white p-4 bg-red-500 rounded-full cursor-pointer" onClick={handleEndCall}/>
            </div>
        );

    return (
        <div className="absolute bottom-40 inset-x-0 flex justify-around">
            <PhoneIcon className="h-20 w-20 rotate-[140deg] text-white p-4 bg-red-500 rounded-full cursor-pointer" onClick={handleRejectCall}/>
            <PhoneIcon className="h-20 w-20 text-white p-4 bg-green-500 rounded-full cursor-pointer" onClick={handleAcceptCall}/>
        </div>
    );
};
