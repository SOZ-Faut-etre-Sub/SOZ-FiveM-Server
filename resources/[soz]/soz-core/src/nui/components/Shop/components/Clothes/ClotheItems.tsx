import { usePlayer } from '@public/nui/hook/data';
import { TaxType } from '@public/shared/tax';
import clsx from 'clsx';
import React, { Fragment, FunctionComponent, useMemo, useState } from 'react';

import { NuiEvent } from '../../../../../shared/event/nui';
import { ClothingShopItem } from '../../../../../shared/shop';
import { fetchNui } from '../../../../fetch';
import { useAssetPath } from '../../../../hook/assets';
import { useGetPrice } from '../../../../hook/price';
import { CategoryItemsHookProps, useCategoryItems } from '../../hooks/useCategoryItems';
import { getApparelIcon } from '../../utils/getApparelItemIcon';
import { getBestClothesPartId } from '../../utils/getBestPartId';
import { CategoryButton } from './CategoryButton';
import { ContentGridWrapper } from './ContentWrapper';

interface ClothesMainCategoriesProps extends CategoryItemsHookProps {
    onSelectedItem: (item: ClothingShopItem) => void;
    isInCayo: boolean;
}

export const ClotheItems: FunctionComponent<ClothesMainCategoriesProps> = ({
    shopCategories,
    underTypes,
    selectedCategory,
    onSelectedItem,
    isInCayo = false,
}) => {
    const [selectedModel, setSelectedModel] = useState<string>();
    const [selectedModelGridIndex, setSelectedModelGridIndex] = useState<number>();
    const [selectedItem, setSelectedItem] = useState<ClothingShopItem | undefined>();

    const { getPath } = useAssetPath();
    const playerData = usePlayer();
    const getPrice = useGetPrice();

    const availableItems = useCategoryItems({ shopCategories, underTypes, selectedCategory });

    const selectedModelItems = useMemo(() => {
        if (!selectedModel) {
            return null;
        }

        return availableItems.find(([model]) => model === selectedModel)?.[1];
    }, [availableItems, selectedModel]);

    const handleSelectModel = (index: number, model: string) => {
        setSelectedModel(model);
        setSelectedModelGridIndex(Math.min((Math.floor(index / 3) + 1) * 3 - 1, availableItems.length - 1));
        setSelectedItem(undefined);
    };

    const handleSelectItem = (id: string) => {
        const item = selectedModelItems.find(item => String(item.id) === id);

        setSelectedItem(item);
        onSelectedItem(item);
    };

    const buyItem = async () => {
        if (!selectedItem) {
            return;
        }

        fetchNui(NuiEvent.ClothingShopBuy, selectedItem).then(() => {
            if (selectedItem.stock === 0) {
                return;
            }

            if (playerData.money.money < getPrice(selectedItem.price, isInCayo ? null : TaxType.SUPPLY)) {
                return;
            }

            // TODO: Visual update the stock.
            // We don't need to wait the backend to update the stock.
            // It will be updated on the next shop opening.
            //  const newShopCategories = { ...shopCategories };
            //  newShopCategories[item.categoryId].content[item.modelLabel].find(i => i.id === item.id).stock--;
            //  setShopCategories(newShopCategories);
        });
    };

    const getCategoryPreview = (items: ClothingShopItem[]) => {
        if (items.length === 0) return '';

        const selectedItem = items[0];

        const type = selectedItem.components ? 'components' : 'props';
        const id = getBestClothesPartId(selectedItem[type]);
        const outfit = selectedItem[type][id];

        return getApparelIcon(playerData, type, Number(id), outfit.Collection, outfit.Drawable, outfit.Texture);
    };

    const getPreviewItem = (items: ClothingShopItem[]) => {
        if (!selectedItem) return getCategoryPreview(items);

        const type = selectedItem.components ? 'components' : 'props';
        const id = getBestClothesPartId(selectedItem[type]);
        const outfit = selectedItem[type][id];

        return getApparelIcon(playerData, type, Number(id), outfit.Collection, outfit.Drawable, outfit.Texture);
    };

    if (!availableItems.length) {
        return null;
    }

    return (
        <ContentGridWrapper>
            {availableItems.map(([model, items], index) => (
                <Fragment key={model}>
                    <CategoryButton
                        className={clsx({ 'scale-105 hover:cursor-default': selectedModel === model })}
                        disabled={selectedModel === model}
                        onClick={() => handleSelectModel(index, model)}
                    >
                        <div className="flex flex-col gap-2 min-w-0 h-full w-full" title={model}>
                            <span className="truncate font-medium">{model}</span>

                            <div
                                className="bg-no-repeat bg-contain bg-center w-full aspect-square"
                                style={{
                                    backgroundImage: `url(${getPath(getCategoryPreview(items))})`,
                                }}
                            />
                        </div>
                    </CategoryButton>

                    {index === selectedModelGridIndex && selectedModelItems && (
                        <div
                            ref={el => el && el.scrollIntoView({ behavior: 'smooth' })}
                            className="col-start-1 col-span-3 max-h-[30vh] hover:cursor-default flex items-center justify-center bg-gradient-to-tr from-white/40 to-white/20 border border-white/20 rounded-lg p-4 text-white transition-all duration-200"
                        >
                            <div className="flex gap-4 h-full">
                                <div className="flex justify-center basis-1/3">
                                    <img className="h-full" src={getPath(getPreviewItem(items))} alt={selectedModel} />
                                </div>

                                <div className="flex flex-col gap-2 grow">
                                    <h2 className="text-left text-xl font-semibold">
                                        {selectedModelItems?.[0].modelLabel}
                                    </h2>

                                    <div className="flex flex-col justify-center items-center w-full grow">
                                        <div className="flex justify-between items-center gap-4 w-full px-2">
                                            <span className="text-base font-medium">Variation</span>
                                            <span>
                                                {selectedItem
                                                    ? selectedModelItems.findIndex(
                                                          item => item.id === selectedItem?.id
                                                      ) + 1
                                                    : 0}
                                                /{selectedModelItems.length}
                                            </span>
                                        </div>

                                        <select
                                            className="w-full rounded-lg bg-transparent py-1 pl-2 text-dark outline-none border border-white/30"
                                            onChange={e => handleSelectItem(e.target.value)}
                                        >
                                            <option value="" disabled selected={!selectedItem}>
                                                Sélectionnez une variante
                                            </option>
                                            {selectedModelItems.map(item => (
                                                <option key={index + item.id} value={item.id} className="text-black">
                                                    {item.colorLabel}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-between items-center gap-4 shrink-0">
                                        {selectedItem && (
                                            <>
                                                <span
                                                    className={clsx('text-xl font-medium text-gray-100', {
                                                        'line-through': selectedItem?.stock === 0,
                                                    })}
                                                >
                                                    ${selectedItem?.price}
                                                </span>

                                                <span className="inline-flex items-center rounded-md px-2 py-1 text-gray-100">
                                                    {selectedItem?.stock === 0 ? (
                                                        <span className="text-red-300">Plus aucun stock</span>
                                                    ) : selectedItem?.stock <= 5 ? (
                                                        <span className="text-orange-300">
                                                            Plus que {selectedItem?.stock} article
                                                            {selectedItem?.stock > 1 && 's'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-300">En stock</span>
                                                    )}
                                                </span>

                                                <button
                                                    className="bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-md"
                                                    disabled={selectedItem.stock === 0}
                                                    onClick={buyItem}
                                                >
                                                    Acheter
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Fragment>
            ))}
        </ContentGridWrapper>
    );
};
