import { Item } from '@public/shared/item';
import { useSelector } from 'react-redux';

import { PlayerData } from '../../shared/player';
import { RootState } from '../store';

export const usePlayer = (): PlayerData | null => {
    return useSelector((state: RootState) => state.player);
};

export const useItems = (): Item[] => {
    return useSelector((state: RootState) => state.item);
};

export const useItem = (id: string): Item | null => {
    return useSelector((state: RootState) => state.item.find(item => item.name === id));
};
