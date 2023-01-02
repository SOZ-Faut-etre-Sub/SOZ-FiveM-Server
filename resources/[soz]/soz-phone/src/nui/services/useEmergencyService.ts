import { useNuiEvent } from '@libs/nui/hooks/useNuiEvent';
import { EmergencyEvents } from '@typings/emergency';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { RootState, store } from '../store';

export const useEmergencyService = () => {
    const emergency = useSelector((state: RootState) => state.emergency);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (!emergency.emergency && pathname === '/emergency') {
            navigate('/', { replace: true });
        }
        if (emergency.emergency && pathname !== '/emergency') {
            navigate('/emergency');
        }
    }, [navigate, emergency, pathname]);

    useNuiEvent('PHONE', EmergencyEvents.SET_EMERGENCY, store.dispatch.emergency.setEmergency);
};
