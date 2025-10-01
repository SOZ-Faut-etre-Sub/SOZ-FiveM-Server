import { useMemo } from 'react';

import { ClothingCategoryID, ClothingShopCategory } from '../../../../shared/shop';
import { usePlayer } from '../../../hook/data';

export interface RootCategoriesHookProps {
    // Contain all categories
    categories: Record<number, ClothingShopCategory>;
    // Contain current shop categories
    shopCategories: Record<number, ClothingShopCategory>;
    underTypes: Record<number, number[]>;
}

export const useRootCategories = ({ categories, shopCategories, underTypes }: RootCategoriesHookProps) => {
    const playerData = usePlayer();

    return useMemo(
        () =>
            Object.values(shopCategories)
                .filter(category => {
                    if (category.parentId) {
                        return false;
                    }

                    // Check if the category is not empty
                    if (
                        Object.values(categories[category.id].content).length == 0 &&
                        Object.values(categories).filter(childCat => childCat.parentId == category.id).length == 0
                    ) {
                        return false;
                    }

                    // Check if the category is not an undershirt or if it is, check if the player can where undershirts with his top
                    if (category.id != ClothingCategoryID.UNDERSHIRTS) {
                        return true;
                    }

                    return (
                        playerData.cloth_config.BaseClothSet.TopID != null &&
                        underTypes[playerData.cloth_config.BaseClothSet.TopID] &&
                        underTypes[playerData.cloth_config.BaseClothSet.TopID].length > 0
                    );
                })
                .sort((a, b) => a.name.localeCompare(b.name)),
        [categories, shopCategories, underTypes, playerData.cloth_config.BaseClothSet.TopID]
    );
};
