import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
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
    const [items, setItems] = useState<any[]>([]);

    useNuiEvent('mask_shop', 'SelectCategory', ({ id, items }) => {
        setItems(items);
        navigate(`/${MenuType.MaskShop}/${id}`);
    });

    if (!catalog || !catalog.shop_categories) {
        return null;
    }

    return (
        <Menu type={MenuType.MaskShop}>
            <MainMenu>
                <MenuTitle banner={banner}>Magasin de masques</MenuTitle>
                <MenuContent>
                    {catalog.shop_categories
                        .map(cat => cat.categories)
                        .map(category => (
                            <MenuItemButton
                                key={category.id}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.ShopMaskSelectCategory, category.id);
                                }}
                            >
                                {category.name}
                            </MenuItemButton>
                        ))}
                </MenuContent>
            </MainMenu>
            {catalog.shop_categories
                .map(cat => cat.categories)
                .map(category => (
                    <SubMenu id={category.id} key={category.id}>
                        <MenuTitle banner={banner}>{category.name}</MenuTitle>
                        <MenuContent>
                            {items.map(item => {
                                let label = item.name;
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
                                        {label}
                                    </MenuItemButton>
                                );
                            })}
                        </MenuContent>
                    </SubMenu>
                ))}
        </Menu>
    );
};
