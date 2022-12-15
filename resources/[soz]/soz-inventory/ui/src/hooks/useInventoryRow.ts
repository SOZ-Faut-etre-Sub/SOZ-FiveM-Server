import { InventoryItem } from '../types/inventory';

export const useInventoryRow = (items: InventoryItem[]) => {
    if (!items || items.length === 0) {
        return 0;
    }

    const maxSlot = items
        .filter((item) => item !== null)
        .sort((a, b) => b.slot - a.slot)[0].slot
    return maxSlot / 5
}
