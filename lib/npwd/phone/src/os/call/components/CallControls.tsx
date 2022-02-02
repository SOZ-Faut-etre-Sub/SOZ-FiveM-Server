import React from 'react';
import { useCall } from '../hooks/useCall';
import { useCallModal } from '../hooks/useCallModal';
import { StatusIconButton } from '@ui/components/StatusIconButton';
import { useHistory } from 'react-router-dom';


export const CallControls = ({ isSmall }: { isSmall?: boolean }) => {
  const history = useHistory();
  const { setModal } = useCallModal();
  const { call, endCall, acceptCall, rejectCall } = useCall();

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
      <div>
        <StatusIconButton
          color="error"
          size={isSmall ? 'small' : 'medium'}
          onClick={handleEndCall}
          className={isSmall ? 'classes.smallIconWrapper' : 'classes.iconWrapper'}
        >
          {/*<CallEndIcon  />*/}
        </StatusIconButton>
      </div>
    );

  return (
    <div>
      <StatusIconButton
        color="error"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleRejectCall}
        className={isSmall ?' classes.smallIconWrapper' : 'classes.iconWrapper'}
      >
        {/*<CallEndIcon  />*/}
      </StatusIconButton>
      <StatusIconButton
        color="success"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleAcceptCall}
        className={isSmall ? 'classes.smallIconWrapper' : 'classes.iconWrapper'}
      >
        {/*<CallIcon  />*/}
      </StatusIconButton>
    </div>
  );
};
