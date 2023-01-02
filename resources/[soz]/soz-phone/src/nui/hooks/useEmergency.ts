import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const useEmergency = () => {
    const state = useSelector((state: RootState) => state.emergency);
    return state.emergency;
};

export const useEmergencyStart = () => {
    const state = useSelector((state: RootState) => state.emergency);
    return state.emergencyStart;
};

export const useLSMCCalled = () => {
    const state = useSelector((state: RootState) => state.emergency);
    return state.lsmcCalled;
};
