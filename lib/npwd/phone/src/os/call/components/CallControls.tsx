import React from 'react';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useCall } from '../hooks/useCall';
import { useCallModal } from '../hooks/useCallModal';
import { StatusIconButton } from '@ui/components/StatusIconButton';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'white',
    boxShadow: '0 .5rem 3rem -.25em rgba(0,0,0,.3)',
  },
  iconWrapper: {
    height: 60,
    width: 60,
  },
  smallIconWrapper: {
    height: 40,
    width: 40,
  },
}));

export const CallControls = ({ isSmall }: { isSmall?: boolean }) => {
  const classes = useStyles();
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
      <Box display="flex" justifyContent="center" px={2} my={2}>
        <StatusIconButton
          color="error"
          size={isSmall ? 'small' : 'medium'}
          onClick={handleEndCall}
          className={isSmall ? classes.smallIconWrapper : classes.iconWrapper}
        >
          <CallEndIcon className={classes.icon} />
        </StatusIconButton>
      </Box>
    );

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" px={2} my={2}>
      <StatusIconButton
        color="error"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleRejectCall}
        className={isSmall ? classes.smallIconWrapper : classes.iconWrapper}
      >
        <CallEndIcon className={classes.icon} />
      </StatusIconButton>
      <StatusIconButton
        color="success"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleAcceptCall}
        className={isSmall ? classes.smallIconWrapper : classes.iconWrapper}
      >
        <CallIcon className={classes.icon} />
      </StatusIconButton>
    </Box>
  );
};
