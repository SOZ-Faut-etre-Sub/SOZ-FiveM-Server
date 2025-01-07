import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { avatarAtom } from '../sim.card.atom';

export const useAvatar = () => {
    const avatar = useAtomValue(avatarAtom);

    const { t } = useTranslation();
    const { addNotification } = useNotifications();

    const updateAvatar = async (avatar: string) => {
        try {
            await fetchNui(NuiEvent.PhoneSimCardUpdateAvatar, { avatar });

            addNotification({
                app: 'settings',
                title: t('SETTINGS.FEEDBACK.UPDATE_SUCCESS'),
            });
        } catch (e) {
            addNotification({
                app: 'settings',
                title: t('SETTINGS.FEEDBACK.UPDATE_FAILED'),
            });
        }
    };

    return {
        avatar,
        updateAvatar,
    };
};
