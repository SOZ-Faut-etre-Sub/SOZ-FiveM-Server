import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { ServerPromiseResp } from '@typings/common';
import { SocietyEvents, SocietyMessage } from '@typings/society';
import { fetchNui } from '@utils/fetchNui';
import { buildRespObj } from '@utils/misc';
import { useLocation } from 'react-router-dom';

import { MockSocietyMessages } from '../utils/constants';
import { useMessagesState } from './state';
import { useMessageActions } from './useMessageActions';
import { useMessageNotifications } from './useMessageNotifications';

export const useSocietyMessagesService = () => {
    const { setNotification } = useMessageNotifications();
    const { updateLocalMessages } = useMessageActions();
    const { pathname } = useLocation();
    const { visibility } = usePhoneVisibility();
    const [, setMessages] = useMessagesState();

    const handleMessageBroadcast = ({
        id,
        conversation_id,
        source_phone,
        message,
        position,
        isTaken,
        takenBy,
        takenByUsername,
        isDone,
        createdAt,
        updatedAt,
    }) => {
        if (visibility && pathname.includes('/society-messages')) {
            return;
        }

        setNotification({ message });
        updateLocalMessages({
            id,
            conversation_id,
            source_phone,
            message,
            position,
            isTaken,
            takenBy,
            takenByUsername,
            isDone,
            createdAt,
            updatedAt,
        });
    };

    const handleResetMessages = async () => {
        try {
            const resp = await fetchNui<ServerPromiseResp<SocietyMessage[]>>(
                SocietyEvents.FETCH_SOCIETY_MESSAGES,
                undefined,
                buildRespObj(MockSocietyMessages)
            );
            setMessages(resp.data.reverse());
        } catch (e) {
            console.error(e);
            setMessages([]);
        }
    };

    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
    useNuiEvent('SOCIETY_MESSAGES', SocietyEvents.RESET_SOCIETY_MESSAGES, handleResetMessages);
};
