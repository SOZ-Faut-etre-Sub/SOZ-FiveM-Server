import { PhoneIcon } from '@heroicons/react/solid';
import { animated, useSpring } from '@react-spring/web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCallAPI } from '../../../api/useCallAPI';
import { CallTimer } from '../../../apps/dialer/components/CallTimer';
import EndCallIcon from '../../../assets/endCall.svg';
import { ContactPicture } from '../../../components/ContactPicture';
import { useCall } from '../../sim-card/hooks/useCall';
import { useContact } from '../../sim-card/hooks/useContact';

export const CallDynamicIsland = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { currentCall } = useCall();
    const { acceptCall, rejectCall, endCall } = useCallAPI();

    const callModalOpen = pathname === '/call';
    const callIncoming = !callModalOpen && Boolean(currentCall);

    const remoteNumber = currentCall?.isTransmitter ? currentCall?.receiver : currentCall?.transmitter;

    const contact = useContact(remoteNumber);

    const styles = useSpring({
        from: {
            opacity: 0,
            height: 0,
            width: 0,
            left: 200,
        },
        to: {
            opacity: callIncoming ? 1 : 0,
            height: callIncoming ? 96 : 0,
            width: callIncoming ? 320 : 0,
            left: callIncoming ? 60 : 200,
        },
    });

    const handleModalClick = () => {
        if (!callIncoming) return;
        navigate('/call');
    };

    const handleAcceptCall = async () => {
        await acceptCall();
        navigate('/call');
    };

    return (
        <animated.div
            className="absolute top-4 flex items-end py-3 px-4 bg-black rounded-3xl cursor-pointer z-50 overflow-hidden"
            onClick={handleModalClick}
            style={styles}
        >
            <div className="flex justify-center items-center gap-3 grow min-w-0">
                <ContactPicture picture={contact?.avatar} />

                <div className="flex flex-col grow truncate">
                    <div className="text-white text-sm truncate">{contact?.display || remoteNumber}</div>
                    <div className="text-gray-400 text-xs">
                        {currentCall?.is_accepted ? (
                            <CallTimer />
                        ) : currentCall?.isTransmitter ? (
                            t('CALLS.MESSAGES.RINGING')
                        ) : (
                            t('CALLS.MESSAGES.INCOMING')
                        )}
                    </div>
                </div>

                <button
                    className="flex justify-center items-center shrink-0 size-8 rounded-full bg-red-500"
                    onClick={!currentCall?.is_accepted && !currentCall?.isTransmitter ? rejectCall : endCall}
                >
                    <EndCallIcon className="size-5 text-white" />
                </button>

                {!currentCall?.is_accepted && !currentCall?.isTransmitter && (
                    <button
                        className="flex justify-center items-center shrink-0 size-8 rounded-full bg-green-500"
                        onClick={handleAcceptCall}
                    >
                        <PhoneIcon className="size-5 text-white" />
                    </button>
                )}
            </div>
        </animated.div>
    );
};
