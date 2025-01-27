import { SOZ_CORE_IS_PRODUCTION } from '@public/globals';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { useNotifications } from '../system/notifications/hooks/useNotifications';
import { useCall } from '../system/sim-card/hooks/useCall';
import { useSimCard } from '../system/sim-card/hooks/useSimCard';

export const useCallAPI = () => {
    const { t } = useTranslation();

    const { number: myPhoneNumber } = useSimCard();
    const { currentCall } = useCall();
    const { addNotification } = useNotifications();

    const initializeCall = useCallback(
        number => {
            // We allow calling of ourselves in development
            if (SOZ_CORE_IS_PRODUCTION && myPhoneNumber === number) {
                return addNotification({ title: t('CALLS.FEEDBACK.ERROR_MYSELF'), app: 'dialer' });
            }

            fetchNui(NuiEvent.PhoneSimCardCallsInit, number)
                .then(resp => {
                    // if (resp.status === 'error') {
                    //     if (resp.data?.isUnavailable) {
                    //       return addNotification({ title: t('CALLS.FEEDBACK.UNAVAILABLE'), app: 'dialer' });
                    //     }
                    // }
                    return addNotification({ title: t('CALLS.FEEDBACK.UNAVAILABLE'), app: 'dialer' });
                })
                .catch(err => {
                    addNotification({ title: t('CALLS.FEEDBACK.ERROR'), app: 'dialer' });
                    console.error(err);
                });
        },
        [addNotification, myPhoneNumber, t]
    );

    const acceptCall = useCallback(
        () => fetchNui(NuiEvent.PhoneSimCardCallsAccept, currentCall.transmitter),
        [currentCall]
    );

    const rejectCall = useCallback(
        () => fetchNui(NuiEvent.PhoneSimCardCallsDecline, currentCall.transmitter),
        [currentCall]
    );

    const endCall = useCallback(() => fetchNui(NuiEvent.PhoneSimCardCallsEnd, currentCall.transmitter), [currentCall]);

    const muteCall = useCallback(() => fetchNui(NuiEvent.PhoneSimCardCallsMute), []);

    return { initializeCall, acceptCall, rejectCall, endCall, muteCall };
};
