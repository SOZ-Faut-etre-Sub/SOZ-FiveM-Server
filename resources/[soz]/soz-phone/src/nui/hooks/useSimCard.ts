import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const usePhoneNumber = () => {
    const state = useSelector((state: RootState) => state.simCard);
    return state.number;
};

export const usePhoneSocietyNumber = () => {
    const state = useSelector((state: RootState) => state.simCard);
    return state.societyNumber;
};

export const useAvatar = () => {
    const state = useSelector((state: RootState) => state.simCard);
    return state.avatar;
};
