import { fetchNui } from '@public/nui/fetch';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { NewSocietyMessage } from '../../../../../../shared/phone/apps/society';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';

export const useContactsAPI = () => {
    const { t } = useTranslation();
    const { addNotification } = useNotifications();

    const sendSocietyMessage = useCallback(
        async (societyMessage: NewSocietyMessage) => {
            try {
                await fetchNui(NuiEvent.PhoneAppSocietySendMessage, societyMessage);
            } catch (e) {
                addNotification({
                    app: 'society-contacts',
                    title: t('SOCIETY_CONTACTS.FEEDBACK.SEND_FAILED'),
                });
            }
        },
        [addNotification, t]
    );

    return { sendSocietyMessage };
};
