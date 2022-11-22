import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { ActiveCall, CallEvents } from '@typings/call';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useEndDialSound } from '../os/call/hooks/useEndDialSound';
import { RootState, store } from '../store';

export const useCallService = () => {
    const modal = useSelector((state: RootState) => state.phone.callModal);
    const { startTone } = useEndDialSound();
    const navigate = useNavigate();
    const { pathname } = useLocation();

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
    }, [navigate, modal, pathname, modalHasBeenOpenedThisCall]);

    useNuiEvent<ActiveCall | null>('CALL', CallEvents.SET_CALLER, callData => {
        if (store.getState().simCard.call !== callData && callData === null) {
            startTone();
        }
        store.dispatch.simCard.setCall(callData);
    });
    useNuiEvent('CALL', CallEvents.SET_CALL_MODAL, store.dispatch.phone.setCallModal);
};
