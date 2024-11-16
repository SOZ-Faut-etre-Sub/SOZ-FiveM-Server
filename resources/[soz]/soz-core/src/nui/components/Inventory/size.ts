import { useSelector } from 'react-redux';

import { RootState } from '../../store';

export type InventorySize = {
    itemSize: number;
    gapSize: number;
    maxHeight: number;
    width: number;
};

export const useItemSize = (): number => {
    const inventorySize = useSelector((state: RootState) => state.hud.settings.inventorySize);

    return Math.round(inventorySize * 70);
};

export const useInventorySize = (nbLines: number): InventorySize => {
    const inventorySize = useSelector((state: RootState) => state.hud.settings.inventorySize);

    const itemSize = Math.round(inventorySize * 70);
    const gapSize = Math.round(inventorySize * 10);

    const maxHeight = itemSize * nbLines + gapSize * (nbLines - 1);
    const width = itemSize * 5 + gapSize * 4;

    return { itemSize, gapSize, maxHeight: maxHeight + gapSize, width } as InventorySize;
};
