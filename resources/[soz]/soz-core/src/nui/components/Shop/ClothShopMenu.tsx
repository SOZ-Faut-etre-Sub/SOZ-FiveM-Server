import { BrandsConfig, ShopBrand, UndershirtDrawablesToExclude } from '@public/config/shops';
import { useNuiEvent } from '@public/nui/hook/nui';
import { Component } from '@public/shared/cloth';
import { PlayerData } from '@public/shared/player';
import { ClothingCategoryID, ClothingShop, ClothingShopCategory } from '@public/shared/shop';
import { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
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
        brand: string;
        shop_content: ClothingShop;
        shop_categories: Record<number, ClothingShopCategory>;
        player_data: PlayerData;
        under_types: Record<number, number[]>;
    };
};

export const ClothShopMenu: FunctionComponent<MenuClothShopStateProps> = ({ catalog }) => {
    const banner = BrandsConfig[catalog.brand as ShopBrand].banner || 'https://nui-img/soz/menu_shop_clothe_normal';
    const shopName = BrandsConfig[catalog.brand as ShopBrand].label || 'Magasin';
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { activeIndex: number } | undefined;
    const [stocks, setStocks] = useState<Record<number, number>>(catalog.shop_content.stocks);
    const [playerData, setPlayerData] = useState<PlayerData>(catalog.player_data);

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

    useNuiEvent('cloth_shop', 'SetStocks', stocks => {
        setStocks(stocks);
    });

    useNuiEvent('cloth_shop', 'SetPlayerData', playerData => {
        setPlayerData(playerData);
    });

    const CategoriesNotEmpty = Object.values(catalog.shop_content.categories).filter(
        category =>
            // Check if the category is not empty
            (Object.values(catalog.shop_categories[category.id].content).length > 0 ||
                Object.values(catalog.shop_categories).filter(childCat => childCat.parentId == category.id).length >
                    0) &&
            // Check if the category is not an undershirt or if it is, check if the player can where undershirts with his top
            (category.id != ClothingCategoryID.UNDERSHIRTS ||
                (playerData.cloth_config.BaseClothSet.TopID != null &&
                    catalog.under_types[playerData.cloth_config.BaseClothSet.TopID] != null &&
                    catalog.under_types[playerData.cloth_config.BaseClothSet.TopID].length > 0))
    );

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
                    {CategoriesNotEmpty.map(category => (
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
            {Object.values(catalog.shop_categories).map(cat => {
                // For each category, filter its subcategories
                const ChildrenCatehoriesNotEmpty = Object.values(catalog.shop_categories).filter(
                    childCat =>
                        // is child
                        childCat.parentId == cat.id &&
                        // has sub category
                        (Object.values(catalog.shop_categories).filter(
                            childchildCat => childchildCat.parentId == childCat.id
                        ).length > 0 || // or has items
                            Object.values(childCat.content).filter(
                                product =>
                                    !product[0].undershirtType ||
                                    (playerData.cloth_config.BaseClothSet.TopID != null &&
                                        catalog.under_types[playerData.cloth_config.BaseClothSet.TopID] &&
                                        catalog.under_types[playerData.cloth_config.BaseClothSet.TopID].includes(
                                            product[0].undershirtType
                                        ))
                            ).length > 0)
                );
                return (
                    <SubMenu key={cat.id} id={String(cat.id)}>
                        <MenuTitle banner={banner}>{cat.name}</MenuTitle>
                        <MenuContent>
                            {ChildrenCatehoriesNotEmpty.map(childCat => (
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
                                            catalog.under_types[playerData.cloth_config.BaseClothSet.TopID] &&
                                            catalog.under_types[playerData.cloth_config.BaseClothSet.TopID].includes(
                                                items[0].undershirtType
                                            ) &&
                                            !UndershirtDrawablesToExclude[playerData.skin.Model.Hash][
                                                playerData.cloth_config.BaseClothSet.Components[Component.Tops].Drawable
                                            ].includes(items[0].components[Component.Undershirt].Drawable))
                                )
                                .sort((a, b) => a[0].localeCompare(b[0]))
                                .map(([modelLabel, items]) => (
                                    <MenuItemSelect
                                        keyDescendant={modelLabel}
                                        key={items[0].id}
                                        title={modelLabel}
                                        titleWidth={60}
                                        value={items[0]}
                                        onConfirm={async (_, item) => await fetchNui(NuiEvent.ClothingShopBuy, item)}
                                        onSelectedValue={async (_, item) =>
                                            await fetchNui(NuiEvent.ClothingShopPreview, item)
                                        }
                                        descriptionValue={item =>
                                            `💸 Prix : $${item.price} - 📦 Stock : ${stocks[item.id]}`
                                        }
                                    >
                                        {items.map(item => (
                                            <MenuItemSelectOption
                                                key={item.id}
                                                value={item}
                                                description={`💸 Prix : $${item.price} - 📦 Stock : ${stocks[item.id]}`}
                                                disabled={stocks[item.id] == 0}
                                                onSelected={async () =>
                                                    await fetchNui(NuiEvent.ClothingShopPreview, item)
                                                }
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
