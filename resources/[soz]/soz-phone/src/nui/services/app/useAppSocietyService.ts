import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { useSoundProvider } from '@os/sound/hooks/useSoundProvider';
import { getSoundSettings } from '@os/sound/utils/getSoundSettings';
import { fetchNui } from '@utils/fetchNui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { SocietyEvents, SocietyMessage } from '../../../../typings/society';
import { useMessageNotifications } from '../../apps/society-messages/hooks/useMessageNotifications';
import { useConfig, useVisibility } from '../../hooks/usePhone';
import { RootState, store } from '../../store';

export const useAppSocietyService = () => {
    const { setNotification } = useMessageNotifications();
    const { mount, play } = useSoundProvider();
    const { visibility } = useVisibility();
    const { pathname } = useLocation();
    const config = useConfig();
    const settings = useSelector((state: RootState) => state.phone.config);

    useEffect(() => {
        store.dispatch.appSociety.loadSocietyMessages();
    }, []);

    const handleMessageBroadcast = (message: SocietyMessage) => {
        store.dispatch.appSociety.appendSocietyMessages(message);

        // Send notificaiton to client (if it's police message only)
        if (message.conversation_id === '555-POLICE' && config.dynamicAlert === true) {
            fetchNui(SocietyEvents.SEND_CLIENT_POLICE_NOTIFICATION, {
                ...message,
                info: { ...message.info, duration: config.dynamicAlertDuration.value },
            });
            const { sound } = getSoundSettings('notiSound', settings, 'messages');
            const volume = config.dynamicAlertVol / 100;
            mount(sound, volume, false).then(({ url }) => play(url));
        }

        if (visibility && pathname.includes('/society-messages')) {
            return;
        }

        if (!message.muted && config.dynamicAlert === false) {
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
