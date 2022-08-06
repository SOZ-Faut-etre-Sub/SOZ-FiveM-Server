import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ServerPromiseResp } from '../../../../typings/common';
import { SocietyEvents, SocietyMessage } from '../../../../typings/society';
import { useMessageNotifications } from '../../apps/society-messages/hooks/useMessageNotifications';
import { MockSocietyMessages } from '../../apps/society-messages/utils/constants';
import { useVisibility } from '../../hooks/usePhone';
import { store } from '../../store';
import { fetchNui } from '../../utils/fetchNui';
import { buildRespObj } from '../../utils/misc';

export const useAppSocietyService = () => {
    const { setNotification } = useMessageNotifications();
    const { visibility } = useVisibility();
    const { pathname } = useLocation();

    useEffect(() => {
        fetchNui<ServerPromiseResp<SocietyMessage[]>>(
            SocietyEvents.FETCH_SOCIETY_MESSAGES,
            undefined,
            buildRespObj(MockSocietyMessages)
        ).then(messages => {
            store.dispatch.appSociety.setSocietyMessages(messages.data);
        });
    }, []);

    const handleMessageBroadcast = (message: SocietyMessage) => {
        if (visibility && pathname.includes('/society-messages')) {
            return;
        }

        setNotification({ message: message.message });
        store.dispatch.appSociety.appendSocietyMessages(message);
    };

    const handleResetMessages = () => {
        try {
            fetchNui<ServerPromiseResp<SocietyMessage[]>>(
                SocietyEvents.FETCH_SOCIETY_MESSAGES,
                undefined,
                buildRespObj(MockSocietyMessages)
            ).then(messages => {
                store.dispatch.appSociety.setSocietyMessages(messages.data);
            });
        } catch (e) {
            console.error(e);
            store.dispatch.appSociety.setSocietyMessages([]);
        }
    };

    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.RESET_SOCIETY_MESSAGES, handleResetMessages);
};
