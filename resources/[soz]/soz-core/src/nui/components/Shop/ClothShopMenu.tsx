import { useNuiEvent } from '@public/nui/hook/nui';
import { PlayerData } from '@public/shared/player';
import { ClothingShop, ClothingShopCategory } from '@public/shared/shop';
import { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle, SubMenu } from '../Styleguide/Menu';

type MenuClothShopStateProps = {
    catalog: {
        brand: string;
        shop_content: ClothingShop;
        shop_categories: Record<number, ClothingShopCategory>;
        player_data: PlayerData;
    };
};

export const ClothShopMenu: FunctionComponent<MenuClothShopStateProps> = ({ catalog }) => {
    const banner =
        catalog.brand == 'ponsonbys'
            ? 'https://nui-img/soz/menu_shop_clothe_luxe'
            : 'https://nui-img/soz/menu_shop_clothe_normal';
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { activeIndex: number } | undefined;
    const [stocks, setStocks] = useState<Record<number, number>>(catalog.shop_content.stocks);

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

    return (
        <Menu type={MenuType.ClothShop}>
            <MainMenu>
                <MenuTitle banner={banner}>
                    Magasin {catalog.brand.charAt(0).toUpperCase() + catalog.brand.slice(1)}
                </MenuTitle>
                <MenuContent>
                    {Object.values(catalog.shop_content.categories).map(category => (
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
            {Object.values(catalog.shop_categories).map(cat => (
                <SubMenu key={cat.id} id={String(cat.id)}>
                    <MenuTitle banner={banner}>{cat.name}</MenuTitle>
                    <MenuContent>
                        {Object.values(catalog.shop_categories)
                            .filter(childCat => childCat.parentId == cat.id)
                            .map(childCat => (
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
                        {Object.values(catalog.shop_content.products)
                            .filter(
                                product =>
                                    product.categoryId == cat.id &&
                                    (product.modelHash == catalog.player_data.skin.Model.Hash ||
                                        product.modelHash == null)
                            )
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map(product => {
                                let description = "Ce produit n'est plus en stock.";
                                if (stocks[product.id] == 1) {
                                    description = "C'est le dernier produit en stock !";
                                } else {
                                    description = `Il reste ${stocks[product.id]} produits en stock.`;
                                }
                                return (
                                    <MenuItemButton
                                        key={product.id}
                                        disabled={stocks[product.id] === 0}
                                        onSelected={async () => await fetchNui(NuiEvent.ClothingShopPreview, product)}
                                        onConfirm={async () => await fetchNui(NuiEvent.ClothingShopBuy, product)}
                                        description={description}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{product.label}</span>
                                            <span className="mr-1">${product.price}</span>
                                        </div>
                                    </MenuItemButton>
                                );
                            })}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};
