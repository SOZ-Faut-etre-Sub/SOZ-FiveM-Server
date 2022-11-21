import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SocietyEvents, SocietyMessage } from '../../../../typings/society';
import { useMessageNotifications } from '../../apps/society-messages/hooks/useMessageNotifications';
import { useVisibility } from '../../hooks/usePhone';
import { store } from '../../store';

export const useAppSocietyService = () => {
    const { setNotification } = useMessageNotifications();
    const { visibility } = useVisibility();
    const { pathname } = useLocation();

    useEffect(() => {
        store.dispatch.appSociety.loadSocietyMessages();
    }, []);

    const handleMessageBroadcast = (message: SocietyMessage) => {
        store.dispatch.appSociety.appendSocietyMessages(message);

        if (visibility && pathname.includes('/society-messages')) {
            return;
        }

        if (!message.muted) {
            setNotification({ message: message.message });
        }
    };

    const handleResetMessages = () => {
        store.dispatch.appSociety.loadSocietyMessages();
    };

    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
    useNuiEvent(
        'SOCIETY_MESSAGES',
        SocietyEvents.UPDATE_SOCIETY_MESSAGE_SUCCESS,
        store.dispatch.appSociety.updateSocietyMessages
    );
    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.RESET_SOCIETY_MESSAGES, handleResetMessages);
};
