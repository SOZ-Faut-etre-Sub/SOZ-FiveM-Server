import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const useEmergency = () => {
    return useSelector((state: RootState) => state.emergency.emergency);
};

export const useEmergencyStart = () => {
    const state = useSelector((state: RootState) => state.emergency);
    return state.emergencyStart;
};

export const useLSMCCalled = () => {
    const state = useSelector((state: RootState) => state.emergency);
    return state.lsmcCalled;
};

export const useIsDead = () => {
    return useSelector((state: RootState) => state.emergency.deathReason);
};
