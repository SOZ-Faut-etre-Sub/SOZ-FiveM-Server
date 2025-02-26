import { PhoneIcon } from '@heroicons/react/solid';
import { useSpring } from '@react-spring/web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCallAPI } from '../../../api/useCallAPI';
import { CallTimer } from '../../../apps/dialer/components/CallTimer';
import EndCallIcon from '../../../assets/endCall.svg';
import { ContactPicture } from '../../../components/ContactPicture';
import { useCall } from '../../sim-card/hooks/useCall';
import { useContact } from '../../sim-card/hooks/useContact';
import { DynamicIslandContainer } from './DynamicIslandContainer';

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
            width: callIncoming ? 400 : 0,
            left: callIncoming ? 20 : 200,
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
        <DynamicIslandContainer onClick={handleModalClick} style={styles}>
            <ContactPicture size="medium" picture={contact?.avatar} />

            <div className="flex flex-col justify-center grow truncate py-1 h-full">
                <div className="text-white text-base truncate">{contact?.display || remoteNumber}</div>
                <div className="text-gray-400 text-sm">
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
                className="flex justify-center items-center shrink-0 size-12 rounded-full bg-red-500"
                onClick={!currentCall?.is_accepted && !currentCall?.isTransmitter ? rejectCall : endCall}
            >
                <EndCallIcon className="size-8 text-white" />
            </button>

            {!currentCall?.is_accepted && !currentCall?.isTransmitter && (
                <button
                    className="flex justify-center items-center shrink-0 size-12 rounded-full bg-green-500"
                    onClick={handleAcceptCall}
                >
                    <PhoneIcon className="size-8 text-white" />
                </button>
            )}
        </DynamicIslandContainer>
    );
};
