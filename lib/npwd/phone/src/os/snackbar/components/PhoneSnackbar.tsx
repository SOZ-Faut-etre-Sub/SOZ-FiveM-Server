import React from 'react';
import {useSnackbar} from '../hooks/useSnackbar';
import Alert from '../../../ui/components/Alert';


export const PhoneSnackbar: React.FC = () => {
    const {alert, isOpen, handleClose} = useSnackbar();

    return (
        <div >
            <Alert severity={alert?.type || 'info'} onClose={handleClose}>
                {alert?.message || ''}
            </Alert>
        </div>
    );
};
