import { BrandsConfig, ShopBrand, UndershirtDrawablesToExclude } from '@public/config/shops';
import { usePlayer } from '@public/nui/hook/data';
import { useNuiEvent } from '@public/nui/hook/nui';
import { Component } from '@public/shared/cloth';
import { ClothingCategoryID, ClothingShop, ClothingShopCategory } from '@public/shared/shop';
import { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TaxType } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useGetPrice } from '../../hook/price';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuClothShopStateProps = {
    catalog: {
        brand: ShopBrand;
        shop_content: ClothingShop;
        shop_categories: Record<number, ClothingShopCategory>;
        under_types: Record<number, number[]>;
        isInCayo: boolean;
    };
};

export const ClothShopMenu: FunctionComponent<MenuClothShopStateProps> = ({
    catalog: { brand, shop_content, shop_categories, under_types, isInCayo },
}: MenuClothShopStateProps) => {
    const getPrice = useGetPrice();
    const [shopCategories, setShopCategories] = useState<Record<number, ClothingShopCategory>>(shop_categories);
    const playerData = usePlayer();

    const banner = BrandsConfig[brand].banner || 'https://nui-img/soz/menu_shop_clothe_normal';
    const shopName = BrandsConfig[brand].label || 'Magasin';
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { activeIndex: number } | undefined;

    const selectCategory = (categoryId: number) => {
        navigate(`/${MenuType.ClothShop}/${categoryId}`, {
            state: {
                ...(state || {}),
                activeIndex: 0,
            },
        });
    };

    useNuiEvent('menu', 'Backspace', () => {
        fetchNui(NuiEvent.ClothingShopBackspace);
    });

    const buyItem = async (_, item) => {
        fetchNui(NuiEvent.ClothingShopBuy, item).then(() => {
            if (item.stock == 0) {
                return;
            }
            // Visual update the stock.
            // We don't need to wait the backend to update the stock.
            // It will be updated on the next shop opening.
            const newShopCategories = { ...shopCategories };
            newShopCategories[item.categoryId].content[item.modelLabel].find(i => i.id === item.id).stock--;
            setShopCategories(newShopCategories);
        });
    };

    const GetRootCategories = Object.values(shop_content.categories)
        .filter(category => {
            if (category.parentId) {
                return false;
            }

            // Check if the category is not empty

            if (
                Object.values(shopCategories[category.id].content).length == 0 &&
                Object.values(shopCategories).filter(childCat => childCat.parentId == category.id).length == 0
            ) {
                return false;
            }
            // Check if the category is not an undershirt or if it is, check if the player can where undershirts with his top

            if (category.id != ClothingCategoryID.UNDERSHIRTS) {
                return true;
            }

            return (
                playerData.cloth_config.BaseClothSet.TopID != null &&
                under_types[playerData.cloth_config.BaseClothSet.TopID] &&
                under_types[playerData.cloth_config.BaseClothSet.TopID].length > 0
            );
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const GetChildrenCategoriesNotEmpty = cat => {
        return Object.values(shopCategories)
            .filter(childCat => {
                // is child
                if (!childCat.parentId) {
                    return false;
                }

                return (
                    childCat.parentId == cat.id &&
                    // has sub category
                    (Object.values(shopCategories).filter(childchildCat => childchildCat.parentId == childCat.id)
                        .length > 0 || // or has items
                        Object.values(childCat.content).filter(
                            product =>
                                !product[0].undershirtType ||
                                (playerData.cloth_config.BaseClothSet.TopID != null &&
                                    under_types[playerData.cloth_config.BaseClothSet.TopID] &&
                                    under_types[playerData.cloth_config.BaseClothSet.TopID]?.includes(
                                        product[0].undershirtType
                                    ))
                        ).length > 0)
                );
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    return (
        <Menu type={MenuType.ClothShop}>
            <MainMenu>
                <MenuTitle banner={banner}>{shopName}</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        onChange={check => {
                            fetchNui(NuiEvent.ClothShopToggleCamera, check);
                        }}
                    >
                        Libérer la caméra
                    </MenuItemCheckbox>
                    {GetRootCategories.map(category => (
                        <MenuItemButton
                            key={category.id}
                            onConfirm={async () => {
                                selectCategory(category.id);
                            }}
                        >
                            {category.name}
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </MainMenu>
            {Object.values(shopCategories).map(cat => {
                return (
                    <SubMenu key={cat.id} id={String(cat.id)}>
                        <MenuTitle banner={banner}>{cat.name}</MenuTitle>
                        <MenuContent>
                            {GetChildrenCategoriesNotEmpty(cat).map(childCat => (
                                <MenuItemButton
                                    key={childCat.id}
                                    onConfirm={async () => {
                                        selectCategory(childCat.id);
                                        fetchNui(NuiEvent.ClothingShopBackspace);
                                    }}
                                >
                                    {childCat.name}
                                </MenuItemButton>
                            ))}
                            {Object.entries(cat.content)
                                .filter(
                                    ([, items]) =>
                                        !items[0].undershirtType ||
                                        (playerData.cloth_config.BaseClothSet.TopID != null &&
                                            under_types[playerData.cloth_config.BaseClothSet.TopID] &&
                                            under_types[playerData.cloth_config.BaseClothSet.TopID]?.includes(
                                                items[0].undershirtType
                                            ) &&
                                            !UndershirtDrawablesToExclude[playerData.skin.Model.Hash][
                                                playerData.cloth_config.BaseClothSet.Components[Component.Tops].Drawable
                                            ]?.includes(items[0].components[Component.Undershirt].Drawable))
                                )
                                .sort((a, b) => a[0].localeCompare(b[0]))
                                .map(([modelLabel, items]) => (
                                    <MenuItemSelect
                                        keyDescendant={modelLabel}
                                        key={items[0].id}
                                        title={modelLabel}
                                        titleWidth={50}
                                        value={items[0]}
                                        onConfirm={buyItem}
                                        onSelectedValue={async (_, item) =>
                                            await fetchNui(NuiEvent.ClothingShopPreview, item)
                                        }
                                        descriptionValue={item => {
                                            return (
                                                <>
                                                    <div>{modelLabel}</div>
                                                    <div>
                                                        ${items.length} Coloris - Prix : $$
                                                        {getPrice(item.price, isInCayo ? null : TaxType.SUPPLY)} - 📦
                                                        Stock : ${item.stock}
                                                    </div>
                                                </>
                                            );
                                        }}
                                    >
                                        {items.map(item => (
                                            <MenuItemSelectOption
                                                key={item.id}
                                                value={item}
                                                description={`💸 Prix : $${getPrice(
                                                    item.price,
                                                    isInCayo ? null : TaxType.SUPPLY
                                                )} - 📦 Stock : ${item.stock}`}
                                                disabled={item.stock == 0}
                                                onSelected={async () =>
                                                    await fetchNui(NuiEvent.ClothingShopPreview, item)
                                                }
                                                helper={item.colorLabel}
                                            >
                                                {item.colorLabel}
                                            </MenuItemSelectOption>
                                        ))}
                                    </MenuItemSelect>
                                ))}
                        </MenuContent>
                    </SubMenu>
                );
            })}
        </Menu>
    );
};
