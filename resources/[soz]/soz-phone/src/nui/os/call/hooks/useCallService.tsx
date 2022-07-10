import { ActiveCall, CallEvents } from '@typings/call';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { callerState } from './state';
import { useCall } from './useCall';
import { useCallModal } from './useCallModal';
import { useCallNotifications } from './useCallNotifications';

// InjectDebugData<CallProps | boolean>([
//   {
//     app: 'CALL',
//     method: CallEvents.SET_CALLER,
//     data: {
//       accepted: true,
//       isTransmitter: false,
//       transmitter: '603-275-8373',
//       receiver: '603-275-4747',
//       active: true,
//     },
//   },
//   {
//     app: 'CALL',
//     method: CallEvents.SET_CALL_MODAL,
//     data: true,
//   },
// ]);

export const useCallService = () => {
    const { modal } = useCallModal();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { setCall } = useCall();

    const { setNotification, clearNotification } = useCallNotifications();

    const setModal = useSetRecoilState(callerState.callModal);

    const [modalHasBeenOpenedThisCall, setModalOpened] = useState<boolean>(false);

    useEffect(() => {
        setModalOpened(!!modal);
    }, [modal]);

    useEffect(() => {
        if (!modal && pathname === '/call') {
            navigate('/', { replace: true });
        }
        if (modal && !modalHasBeenOpenedThisCall && pathname !== '/call') {
            navigate('/call');
        }
    }, [history, modal, pathname, modalHasBeenOpenedThisCall]);

    useNuiEvent<ActiveCall | null>('CALL', CallEvents.SET_CALLER, callData => {
        setCall(callData);

        if (!callData) return clearNotification();
        setNotification(callData);
    });
    useNuiEvent('CALL', CallEvents.SET_CALL_MODAL, setModal);
};
