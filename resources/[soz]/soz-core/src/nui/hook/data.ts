import { DrugNuiZone } from '@private/shared/drugs';
import { HudState, HudTheme } from '@public/shared/hud';
import { Item } from '@public/shared/item';
import { Vector3 } from '@public/shared/polyzone/vector';
import { VehicleHud } from '@public/shared/vehicle/vehicle';
import { useSelector } from 'react-redux';

import { PlayerData } from '../../shared/player';
import { RootState } from '../store';

export const usePlayer = (): PlayerData | null => {
    return useSelector((state: RootState) => state.player);
};

export const usePlayerPosition = (): Vector3 => {
    return useSelector((state: RootState) => state.playerPosition);
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

export const useMinimap = (): HudState['minimap'] => {
    return useSelector((state: RootState) => state.hud.minimap);
};

export const useAmmo = (): HudState['ammo'] => {
    return useSelector((state: RootState) => state.hud.ammo);
};

export const useDrugLocation = (): DrugNuiZone[] => {
    return useSelector((state: RootState) => state.drugLocation);
};

export const useDateTime = (): { isDay: boolean; isNight: boolean } => {
    const dateTime = useSelector((state: RootState) => state.hud.dateTime);
    return {
        isDay: dateTime.hour > 6 && dateTime.hour < 20,
        isNight: dateTime.hour < 6 || dateTime.hour > 20,
    };
};

export const useHudTheme = (): HudTheme => {
    const theme = useSelector((state: RootState) => state.hud.settings.theme);
    const { isNight } = useDateTime();

    if (theme === HudTheme.Auto) {
        return isNight ? HudTheme.Light : HudTheme.Dark;
    }
    return theme;
};
