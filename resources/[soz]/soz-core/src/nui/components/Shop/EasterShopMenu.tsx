import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { ShopProduct } from '../../../shared/shop';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type MenuEasterShopStateProps = {
    data: ShopProduct[];
};

export const EasterShopMenu: FunctionComponent<MenuEasterShopStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_shop_easter';

    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.EasterShop}>
            <MainMenu>
                <MenuTitle banner={banner}>Magasin société</MenuTitle>
                <MenuContent>
                    {data.map((product, id) => (
                        <MenuItemButton
                            key={id}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.EasterShopBuy, product.id);
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
