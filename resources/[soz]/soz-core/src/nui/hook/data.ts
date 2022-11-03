import { useSelector } from 'react-redux';

import { PlayerData } from '../../shared/player';
import { RootState } from '../store';

export const usePlayer = (): PlayerData | null => {
    return useSelector((state: RootState) => state.player);
};
