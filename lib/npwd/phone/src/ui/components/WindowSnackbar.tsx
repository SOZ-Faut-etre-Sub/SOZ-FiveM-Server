import React, { useState } from 'react';
import { Alert } from './Alert';
import { useNuiEvent } from 'fivem-nui-react-lib';

// NOTE: Will make this more generic at some point for error handling as well
const WindowSnackbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'info' | 'error' | 'success'>('info');

  useNuiEvent('PHONE', 'startRestart', () => {
    setMessage('Restarting UI');
    setOpen(true);
    setSeverity('error');
    setTimeout(() => window.location.reload(), 3000);
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div >
      <Alert severity={severity}>
        <div >Phone - {message}</div>
      </Alert>
    </div>
  );
};

export default WindowSnackbar;
