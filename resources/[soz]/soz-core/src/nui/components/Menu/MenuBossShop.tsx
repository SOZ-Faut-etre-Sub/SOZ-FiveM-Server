import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { BossShopMenu } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type MenuBossShopProps = {
    data?: BossShopMenu;
};

export const MenuBossShop: FunctionComponent<MenuBossShopProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const onConfirm = item => {
        fetchNui(NuiEvent.JobBossShopBuyItem, {
            item,
            job: data.job,
        });
    };

    return (
        <Menu type={MenuType.BossShop}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_society">Boutique entreprise</MenuTitle>
                <MenuContent>
                    {data.shop.items.map((item, index) => {
                        return (
                            <MenuItemButton key={index} onConfirm={() => onConfirm(item)}>
                                {item.name}
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
