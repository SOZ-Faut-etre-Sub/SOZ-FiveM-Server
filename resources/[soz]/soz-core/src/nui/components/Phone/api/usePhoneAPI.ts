import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { useNotifications } from '../system/notifications/hooks/useNotifications';

export const usePhoneAPI = () => {
    const { t } = useTranslation();

    const { addNotification } = useNotifications();

    const resetPhone = useCallback(async () => {
        try {
            await fetchNui(NuiEvent.PhoneSimCardReset);
            addNotification({
                app: 'settings',
                title: t('SETTINGS.FEEDBACK.RESET_SUCCESS'),
            });
        } catch (err) {
            console.error(err);
            addNotification({
                app: 'settings',
                title: t('SETTINGS.FEEDBACK.RESET_FAILED'),
            });
        }
    }, []);

    return { resetPhone };
};
