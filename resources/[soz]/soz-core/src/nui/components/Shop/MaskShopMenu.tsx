import { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { isOk, Result } from '../../../shared/result';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle, SubMenu } from '../Styleguide/Menu';

type MenuMaskShopStateProps = {
    catalog: {
        name: string;
        shop_categories: any[];
        shop_content: any[];
    };
};

export const MaskShopMenu: FunctionComponent<MenuMaskShopStateProps> = ({ catalog }) => {
    const banner = 'https://nui-img/soz/menu_shop_accessory';
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState<any[]>([]);

    const selectCategory = (id, items) => {
        setItems(items);
        navigate(`/${MenuType.MaskShop}/${id}`, {
            state: location.state,
        });
    };

    useNuiEvent('mask_shop', 'SelectCategory', ({ id, items }) => {
        selectCategory(id, items);
    });

    if (!catalog || !catalog.shop_categories) {
        return null;
    }

    return (
        <Menu type={MenuType.MaskShop}>
            <MainMenu>
                <MenuTitle banner={banner}>Magasin de masque</MenuTitle>
                <MenuContent>
                    {catalog.shop_categories
                        .map(cat => cat.category)
                        .map(category => (
                            <MenuItemButton
                                key={category.id}
                                onConfirm={async () => {
                                    const result: Result<any, never> = await fetchNui(
                                        NuiEvent.ShopMaskSelectCategory,
                                        category.id
                                    );
                                    if (isOk(result)) {
                                        selectCategory(category.id, result.ok);
                                    }
                                }}
                            >
                                {category.name}
                            </MenuItemButton>
                        ))}
                </MenuContent>
            </MainMenu>
            {catalog.shop_categories
                .map(cat => cat.category)
                .map(category => (
                    <SubMenu id={category.id} key={category.id}>
                        <MenuTitle banner={banner}>{category.name}</MenuTitle>
                        <MenuContent>
                            {items
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map(item => {
                                    let label = item.label;
                                    switch (item.stock) {
                                        case 0:
                                            label += ' (Rupture de stock)';
                                            break;
                                        case 1:
                                            label += ' (Dernier exemplaire)';
                                            break;
                                    }
                                    return (
                                        <MenuItemButton
                                            key={item.id}
                                            disabled={item.stock === 0}
                                            onSelected={async () => {
                                                await fetchNui(NuiEvent.ShopMaskPreview, JSON.parse(item.data));
                                            }}
                                            onConfirm={async () => {
                                                await fetchNui(NuiEvent.ShopMaskBuy, item.id);
                                            }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{label}</span>
                                                <span className="mr-1">${item.price}</span>
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
