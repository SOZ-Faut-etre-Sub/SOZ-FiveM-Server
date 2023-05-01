import { HudState } from '@public/shared/hud';
import { Item } from '@public/shared/item';
import { VehicleHud } from '@public/shared/vehicle/vehicle';
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

export const useAllowedOutside = (): Record<string, HTMLElement> => {
    return useSelector((state: RootState) => state.outside);
};

export const useVehicle = (): VehicleHud => {
    return useSelector((state: RootState) => state.vehicle);
};

export const useHud = (): HudState => {
    return useSelector((state: RootState) => state.hud);
};
