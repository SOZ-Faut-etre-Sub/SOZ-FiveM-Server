import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { useAssetPath } from '../../../../hook/assets';
import { CategoryHookProps, useCategory } from '../../hooks/useCategory';
import { CategoryButton } from './CategoryButton';
import { ContentGridWrapper } from './ContentWrapper';

interface ClothesMainCategoriesProps extends CategoryHookProps {
    setSelectedCategory: Dispatch<SetStateAction<number>>;
}

export const ClotheCategories: FunctionComponent<ClothesMainCategoriesProps> = ({
    shopCategories,
    underTypes,
    selectedCategory,
    setSelectedCategory,
}) => {
    const { getPath } = useAssetPath();

    const availableCategories = useCategory({ shopCategories, underTypes, selectedCategory });

    if (!availableCategories.length) {
        return null;
    }

    return (
        <ContentGridWrapper>
            {availableCategories.map(category => (
                <CategoryButton
                    key={category.id}
                    className="flex flex-col min-w-0"
                    onClick={() => setSelectedCategory(category.id)}
                >
                    <span className="font-medium truncate w-full">{category.name}</span>

                    <img src={getPath(`images/shop/ponsonbys/placeholder.webp`)} alt={category.name} />
                </CategoryButton>
            ))}
        </ContentGridWrapper>
    );
};
