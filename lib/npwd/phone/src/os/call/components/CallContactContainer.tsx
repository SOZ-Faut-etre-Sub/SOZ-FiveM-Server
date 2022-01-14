import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useContactActions } from '../../../apps/contacts/hooks/useContactActions';
import { useCall } from '../hooks/useCall';
import { useTranslation } from 'react-i18next';

const CallContactContainer = () => {
  const [t] = useTranslation();
  const { call } = useCall();

  const { getDisplayByNumber, getPictureByNumber } = useContactActions();

  const getDisplayOrNumber = () =>
    call.isTransmitter ? getDisplayByNumber(call?.receiver) : getDisplayByNumber(call?.transmitter);

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} overflow="hidden" textOverflow="ellipsis">
        <Typography variant="body1">
          {call.isTransmitter
            ? t('CALLS.MESSAGES.OUTGOING').toUpperCase()
            : t('CALLS.MESSAGES.INCOMING').toUpperCase()}
        </Typography>
        <Typography variant="h4">{getDisplayOrNumber()}</Typography>
      </Box>
      <Avatar
        sx={{ ml: 1, height: 80, width: 80 }}
        alt={getDisplayOrNumber()}
        src={
          call.isTransmitter
            ? getPictureByNumber(call.receiver)
            : getPictureByNumber(call?.transmitter)
        }
      />
    </Box>
  );
};

export default CallContactContainer;
