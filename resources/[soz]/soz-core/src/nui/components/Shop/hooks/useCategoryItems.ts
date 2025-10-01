import { useMemo } from 'react';

import { ClothingShopCategory } from '../../../../shared/shop';
import { usePlayer } from '../../../hook/data';

export interface CategoryItemsHookProps {
    // Contain current shop categories
    shopCategories: Record<number, ClothingShopCategory>;
    underTypes: Record<number, number[]>;
    selectedCategory: number;
}

export const useCategoryItems = ({ shopCategories, underTypes, selectedCategory }: CategoryItemsHookProps) => {
    const playerData = usePlayer();

    return useMemo(() => {
        if (!shopCategories[selectedCategory]) {
            return [];
        }

        return Object.entries(shopCategories[selectedCategory].content)
            .filter(
                ([, items]) =>
                    !items[0].undershirtType ||
                    (playerData.cloth_config.BaseClothSet.TopID != null &&
                        underTypes[playerData.cloth_config.BaseClothSet.TopID] &&
                        !!items.find(item =>
                            underTypes[playerData.cloth_config.BaseClothSet.TopID]?.includes(item.undershirtType)
                        ))
            )
            .sort((a, b) => a[0].localeCompare(b[0]));
    }, [selectedCategory, shopCategories, underTypes, playerData.cloth_config.BaseClothSet.TopID]);
};
