import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NewMessage } from '../../../../../../shared/phone/simcard';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';

type UseMessageAPIProps = {
    sendMessage: (message: NewMessage) => void;
};

export const useMessageAPI = (): UseMessageAPIProps => {
    const { t } = useTranslation();

    const { addNotification } = useNotifications();

    const sendMessage = useCallback(
        async (message: NewMessage) => {
            try {
                await fetchNui(NuiEvent.PhoneSimCardSendMessage, message);
            } catch (e) {
                addNotification({
                    app: 'messages',
                    title: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
                });
            }
        },
        [t, addNotification]
    );

    return {
        sendMessage,
    };
};
