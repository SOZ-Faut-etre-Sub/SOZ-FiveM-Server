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
import { usePhoneSocietyNumber } from '../../hooks/useSimCard';
import { RootState, store } from '../../store';

export const useAppSocietyService = () => {
    const { setNotification } = useMessageNotifications();
    const { mount, play } = useSoundProvider();
    const { visibility } = useVisibility();
    const { pathname } = useLocation();
    const config = useConfig();
    const settings = useSelector((state: RootState) => state.phone.config);
    const emergency = useSelector((state: RootState) => state.emergency.emergency);
    const available = useSelector((state: RootState) => state.phone.available);
    const societyNumber = usePhoneSocietyNumber();

    useEffect(() => {
        store.dispatch.appSociety.loadSocietyMessages();
    }, []);

    const handleMessageBroadcast = (message: SocietyMessage) => {
        store.dispatch.appSociety.appendSocietyMessages(message);

        const policeNumbers = ['555-POLICE', '555-BCSO', '555-LSPD', '555-FBI'];

        // Send notificaiton to client (if it's police message only)
        if (
            policeNumbers.includes(message.conversation_id) &&
            config.dynamicAlert === true &&
            !message.muted &&
            available &&
            !emergency
        ) {
            fetchNui(SocietyEvents.SEND_CLIENT_POLICE_NOTIFICATION, {
                ...message,
                info: { ...message.info, duration: config.dynamicAlertDuration.value },
            });
            const { sound } = getSoundSettings('societyNotification', settings);
            const volume = config.dynamicAlertVol / 100;
            mount(sound, volume, false).then(({ url }) => play(url));
        }

        if (visibility && pathname.includes('/society-messages')) {
            return;
        }

        if (!message.muted && (config.dynamicAlert === false || !policeNumbers.includes(societyNumber))) {
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
