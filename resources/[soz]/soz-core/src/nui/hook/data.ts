import { DrugNuiZone } from '@private/shared/drugs';
import { HudState, HudTheme } from '@public/shared/hud';
import { InventoryConfiguration, InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';
import { Vector3 } from '@public/shared/polyzone/vector';
import { VehicleHud } from '@public/shared/vehicle/vehicle';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { PlayerData } from '../../shared/player';
import { RootState } from '../store';

export const usePlayer = (): PlayerData | null => {
    return useSelector((state: RootState) => state.player);
};

export const usePlayerPosition = (): Vector3 => {
    return useSelector((state: RootState) => state.playerPosition);
};

export const usePlayerInventoryConfiguration = (): InventoryConfiguration => {
    return useSelector((state: RootState) => state.playerInventory.configuration);
};

export const usePlayerInventoryItems = (): Record<number, InventoryItem> => {
    return useSelector((state: RootState) => state.playerInventory.items);
};

export const useItems = (): Item[] => {
    return useSelector((state: RootState) => state.item);
};

export const useItemResolver = (): ((id: string) => Item) => {
    const items = useItems();

    return useMemo(() => {
        const indexedItems = new Map<string, Item>();

        for (const item of items) {
            indexedItems.set(item.name, item);
        }

        return (name: string) => indexedItems.get(name);
    }, [items]);
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
    const isNight = useSelector((state: RootState) => state.hud.dateTime.isNight);

    return {
        isDay: !isNight,
        isNight,
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

export const useHudHasStreetNames = (): boolean => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showStreetName = useSelector((state: RootState) => state.hud.settings.showStreetName);

    return hasWatch && showStreetName;
};
