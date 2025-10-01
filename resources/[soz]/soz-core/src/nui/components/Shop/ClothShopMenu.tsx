import { useNuiEvent } from '@public/nui/hook/nui';
import { ShopCatalog } from '@public/shared/nui/cloth_shop';
import { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { useNuiFocus } from '../../hook/nui';
import { ClotheCategories } from './components/Clothes/ClotheCategories';
import { ClotheItems } from './components/Clothes/ClotheItems';
import { ClothesApplication } from './components/Clothes/ClothesApplication';
import { MainCategories } from './components/Clothes/MainCategories';

export const ClothShopMenu: FunctionComponent = () => {
    const [catalog, setCatalog] = useState<ShopCatalog>();

    const [selectedCategory, setSelectedCategory] = useState<number>();

    useNuiFocus(!!catalog, !!catalog, false);

    useNuiEvent('cloth_shop', 'SetCatalog', setCatalog);

    const onKeyUpReceived = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;

        setSelectedCategory(undefined);
        fetchNui(NuiEvent.ClothingShopClose);
    };

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    if (!catalog) {
        return null;
    }

    return (
        <ClothesApplication
            shopBrand={catalog.brand}
            shopCategories={catalog.shop_categories}
            selectedCategory={selectedCategory}
            onNavigate={setSelectedCategory}
        >
            {selectedCategory ? (
                <>
                    <ClotheCategories
                        shopCategories={catalog.shop_categories}
                        underTypes={catalog.under_types}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                    <ClotheItems
                        shopCategories={catalog.shop_categories}
                        underTypes={catalog.under_types}
                        selectedCategory={selectedCategory}
                        onSelectedItem={item => fetchNui(NuiEvent.ClothingShopPreview, item)}
                        isInCayo={catalog.isInCayo}
                    />
                </>
            ) : (
                <MainCategories
                    categories={catalog.shop_categories}
                    shopCategories={catalog.shop_content.categories}
                    underTypes={catalog.under_types}
                    setSelectedCategory={setSelectedCategory}
                />
            )}
        </ClothesApplication>
    );
};
