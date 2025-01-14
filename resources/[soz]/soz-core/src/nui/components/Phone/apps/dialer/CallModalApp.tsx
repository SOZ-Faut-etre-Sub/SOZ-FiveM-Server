import { PhoneIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { BsFillMicMuteFill, BsPersonFillAdd, BsVolumeUpFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import EndCallIcon from '../../assets/endCall.svg';
import { ContactPicture } from '../../components/ContactPicture';
import { AppContainer } from '../../components/system/AppContainer';
import { useCall } from '../../system/sim-card/hooks/useCall';
import { useContact } from '../../system/sim-card/hooks/useContact';
import { CallButton } from './components/CallButton';
import { CallTimer } from './components/CallTimer';
import { RingingText } from './components/RingingText';

export const CallModalApp = () => {
    const { currentCall } = useCall();
    const navigate = useNavigate();

    const receiverContact = useContact(currentCall.receiver);
    const transmitterContact = useContact(currentCall.transmitter);

    const targetNumber = currentCall.isTransmitter ? currentCall.receiver : currentCall.transmitter;
    const targetContact = currentCall.isTransmitter ? receiverContact : transmitterContact;

    const callInProgress = currentCall?.is_accepted || currentCall?.isTransmitter;

    const handleAcceptCall = () => {};

    const handleRejectCall = () => {};

    const handleEndCall = () => {};

    const handleMuteCall = () => {};

    return (
        <AppContainer className="bg-black/30 text-white backdrop-blur" disableBackground forceControlColor="light">
            <div className="flex flex-col justify-center items-center font-semibold py-10">
                {currentCall?.is_accepted ? <CallTimer /> : currentCall?.isTransmitter && <RingingText />}
                <div className="text-3xl text-center w-full px-10 truncate">
                    {targetContact?.display ?? targetNumber}
                </div>
            </div>

            <div className="flex flex-col justify-center items-center text-white">
                <ContactPicture size="xlarge" picture={targetContact?.avatar} />
            </div>

            <div className="absolute bottom-40 grid grid-cols-3 gap-5 w-full px-5">
                <CallButton label="Audio" icon={BsVolumeUpFill} onClick={() => {}} />
                {!targetContact && (
                    <CallButton
                        label="Ajouter"
                        icon={BsPersonFillAdd}
                        onClick={() => navigate(`/contacts/-1?addNumber=${targetNumber}`)}
                    />
                )}
                <CallButton
                    label="Mute"
                    icon={BsFillMicMuteFill}
                    onClick={handleMuteCall}
                    containerClassName={targetContact ? 'col-start-3' : ''}
                    className={clsx({
                        'bg-white/80': currentCall.muted,
                    })}
                    iconClassName={clsx({
                        'text-red-500': currentCall.muted,
                    })}
                />

                {callInProgress ? (
                    <CallButton
                        label="End"
                        icon={EndCallIcon}
                        onClick={handleEndCall}
                        containerClassName="col-span-3"
                        className="bg-red-500"
                        iconClassName="text-white"
                    />
                ) : (
                    <>
                        <CallButton
                            label="Rejeter"
                            icon={EndCallIcon}
                            onClick={handleRejectCall}
                            className="bg-red-500"
                            iconClassName="text-white"
                        />

                        <CallButton
                            label="Accepter"
                            icon={PhoneIcon}
                            onClick={handleAcceptCall}
                            containerClassName="col-start-3"
                            className="bg-green-500"
                            iconClassName="text-white"
                        />
                    </>
                )}
            </div>
        </AppContainer>
    );
};
