import { ShopItem } from '../types/shop';

export const useShopRow = (items: ShopItem[]) => {
    if (!items || items.length === 0) {
        return 0;
    }
    const maxSlot = items
        .filter((item) => item !== null)
        .sort((a, b) => b.slot - a.slot)[0].slot

    return Math.ceil(items.length / 5)
}
