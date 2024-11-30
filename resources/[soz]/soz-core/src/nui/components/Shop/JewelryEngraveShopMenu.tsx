import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';
import { MenuType } from '@public/shared/nui/menu';
import { ENGRAVE_PRICE } from '@public/shared/shop';
import { FunctionComponent } from 'react';

import { TaxType } from '../../../shared/bank';
import { useGetPrice } from '../../hook/price';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type MenuJewelryEngraveShopProps = {
    data: {
        engravableItems: { inventoryItem: InventoryItem; item: Item }[];
    };
};

export const JewelryEngraveShopMenu: FunctionComponent<MenuJewelryEngraveShopProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_shop_jewelry';
    const getPrice = useGetPrice();

    if (!data || !data.engravableItems?.length) {
        return null;
    }

    return (
        <Menu type={MenuType.JewelryEngraveShop}>
            <MainMenu>
                <MenuTitle banner={banner}> Bijoutier - Service de gravure</MenuTitle>
                <MenuContent>
                    {data.engravableItems.map(({ inventoryItem, item }) => (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.JewelryShopEngraveItem, inventoryItem);
                            }}
                        >
                            {item.label}
                        </MenuItemButton>
                    ))}
                    <MenuItemText>
                        <div className="pr-2 flex items-center justify-between">
                            <span>Prix de la gravure</span>
                            <span>💸 ${getPrice(ENGRAVE_PRICE, TaxType.SUPPLY)}</span>
                        </div>
                    </MenuItemText>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
