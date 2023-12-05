import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ActiveCall } from '@typings/call';
import { CallEvents } from '@typings/call';
import { ServerPromiseResp } from '@typings/common';
import { PhoneEvents } from '@typings/phone';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { SOZ_PHONE_IS_PRODUCTION } from '../../../../globals';
import { usePhoneNumber } from '../../../hooks/useSimCard';
import { useCall as useCallHook } from '../../../hooks/useSimCard';
import { fetchNui } from '../../../utils/fetchNui';

interface CallHook {
    call: ActiveCall;
    acceptCall(): void;
    rejectCall(): void;
    endCall(): void;
    muteCall(state: boolean): void;
    initializeCall(number: string): void;
}

// const TIME_TILL_AUTO_HANGUP = 15000;

export const useCall = (): CallHook => {
    const call = useCallHook();
    // const [dialRing, setDialRing] = useState(false);
    const myPhoneNumber = usePhoneNumber();
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();
    // const { endDialTone, startDialTone } = useDialingSound();

    const initializeCall = useCallback(
        number => {
            // We allow calling of ourselves in development
            if (SOZ_PHONE_IS_PRODUCTION && myPhoneNumber === number) {
                return addAlert({ message: t('CALLS.FEEDBACK.ERROR_MYSELF'), type: 'error' });
            }

            fetchNui<ServerPromiseResp<{ isUnavailable: boolean }>>(CallEvents.INITIALIZE_CALL, {
                receiverNumber: number,
            }).then(resp => {
                if (resp.status === 'error') {
                    if (resp.data?.isUnavailable) {
                        return addAlert({ message: t('CALLS.FEEDBACK.UNAVAILABLE'), type: 'error' });
                    }

                    addAlert({ message: t('CALLS.FEEDBACK.ERROR'), type: 'error' });
                    console.error(resp.errorMsg);
                }
            });
        },
        [addAlert, myPhoneNumber, t]
    );

    const acceptCall = useCallback(() => {
        fetchNui(CallEvents.ACCEPT_CALL, {
            transmitterNumber: call.transmitter,
        });
        fetchNui(PhoneEvents.TOGGLE_KEYS, {
            keepGameFocus: true,
        });
    }, [call]);

    const rejectCall = useCallback(() => {
        fetchNui(CallEvents.REJECTED, {
            transmitterNumber: call.transmitter,
        });
        fetchNui(PhoneEvents.TOGGLE_KEYS, {
            keepGameFocus: true,
        });
    }, [call]);

    const endCall = useCallback(() => {
        fetchNui(CallEvents.END_CALL, {
            transmitterNumber: call.transmitter,
            isTransmitter: call.transmitter === myPhoneNumber,
        });
    }, [call, myPhoneNumber]);

    const muteCall = useCallback(
        state => {
            fetchNui(CallEvents.MUTE_PLAYER_CALL, {
                transmitterNumber: call.transmitter,
                isTransmitter: call.isTransmitter,
                muted: state,
            });
        },
        [call, myPhoneNumber]
    );

    return { call, acceptCall, rejectCall, endCall, muteCall, initializeCall };
};
