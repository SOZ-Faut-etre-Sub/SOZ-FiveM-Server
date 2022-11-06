import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { ShopProduct } from '../../../shared/shop';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type MenuBossShopStateProps = {
    data: {
        job: string;
        products: ShopProduct[];
    };
};

export const BossShopMenu: FunctionComponent<MenuBossShopStateProps> = ({ data: { job, products } }) => {
    const banner = 'https://nui-img/soz/menu_shop_society';

    if (!products) {
        return null;
    }

    return (
        <Menu type={MenuType.BossShop}>
            <MainMenu>
                <MenuTitle banner={banner}>Magasin société</MenuTitle>
                <MenuContent>
                    {products.map((product, id) => (
                        <MenuItemButton
                            key={id}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.BossShopBuy, { job, id: product.id });
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <span>{product.item?.label ?? '[invalid name]'}</span>
                                <span className="mr-1">${product.price}</span>
                            </div>
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
