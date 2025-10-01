import { useMemo } from 'react';

import { ClothingShopCategory } from '../../../../shared/shop';
import { usePlayer } from '../../../hook/data';

export interface CategoryHookProps {
    // Contain current shop categories
    shopCategories: Record<number, ClothingShopCategory>;
    underTypes: Record<number, number[]>;
    selectedCategory: number;
}

export const useCategory = ({ shopCategories, underTypes, selectedCategory }: CategoryHookProps) => {
    const playerData = usePlayer();

    return useMemo(
        () =>
            Object.values(shopCategories)
                .filter(category => {
                    // Ensure category is a child
                    if (!category.parentId) {
                        return false;
                    }

                    if (category.parentId !== selectedCategory) {
                        return false;
                    }

                    return (
                        category.parentId === selectedCategory &&
                        // has sub category
                        (Object.values(shopCategories).filter(c => c.parentId === category.id).length > 0 || // or has items
                            Object.values(category.content).filter(
                                product =>
                                    !product[0].undershirtType ||
                                    (playerData.cloth_config.BaseClothSet.TopID != null &&
                                        underTypes[playerData.cloth_config.BaseClothSet.TopID] &&
                                        !!product.find(item =>
                                            underTypes[playerData.cloth_config.BaseClothSet.TopID]?.includes(
                                                item.undershirtType
                                            )
                                        ))
                            ).length > 0)
                    );
                })
                .sort((a, b) => a.name.localeCompare(b.name)),
        [selectedCategory, shopCategories, underTypes, playerData.cloth_config.BaseClothSet.TopID]
    );
};
