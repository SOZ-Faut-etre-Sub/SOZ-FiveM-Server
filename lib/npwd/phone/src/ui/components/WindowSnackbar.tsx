import React, { useState } from 'react';
import { Alert } from './Alert';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { Transition } from '@headlessui/react';

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
      <Transition
          appear={true}
          show={open}
          unmount={false}
          className="absolute inset-x-0 z-40"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
      >
      <Alert severity={severity} onClose={handleClose}>
        <p>Phone -{message}</p>
      </Alert>
    </Transition>
  );
};

export default WindowSnackbar;
