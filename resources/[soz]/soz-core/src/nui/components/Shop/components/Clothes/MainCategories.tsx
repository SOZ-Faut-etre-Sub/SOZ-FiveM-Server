import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { useAssetPath } from '../../../../hook/assets';
import { RootCategoriesHookProps, useRootCategories } from '../../hooks/useRootCategories';
import { CategoryButton } from './CategoryButton';
import { ContentGridWrapper } from './ContentWrapper';

interface ClothesMainCategoriesProps extends RootCategoriesHookProps {
    setSelectedCategory: Dispatch<SetStateAction<number>>;
}

export const MainCategories: FunctionComponent<ClothesMainCategoriesProps> = ({
    categories,
    shopCategories,
    underTypes,
    setSelectedCategory,
}) => {
    const { getPath } = useAssetPath();

    const availableCategories = useRootCategories({
        categories,
        shopCategories,
        underTypes,
    });

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
