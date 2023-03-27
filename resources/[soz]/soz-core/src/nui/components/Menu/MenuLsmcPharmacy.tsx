import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { PHARMACY_PRICES } from '../../../shared/job/lsmc';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

const products: Record<string, string> = {
    tissue: 'mouchoir',
    antibiotic: 'antibiotique',
    pommade: 'pommade',
    painkiller: 'antidouleur',
    antiacide: 'antiacide',
};

export const MenuLsmcPharmacy: FunctionComponent = () => {
    const onConfirm = (item: string) => {
        fetchNui(NuiEvent.LsmcPharmacyBuyItem, { item });
    };

    return (
        <Menu type={MenuType.LsmcPharmacy}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_pharmacy">Un petit pansement ?</MenuTitle>
                <MenuContent>
                    {Object.entries(products).map(([item, label]) => (
                        <MenuItemButton onConfirm={() => onConfirm(item)}>
                            <div className="pr-2 flex items-center justify-between">
                                <span className="capitalize">{label}</span>
                                <span>💸 ${PHARMACY_PRICES?.[item]?.toFixed(0)}</span>
                            </div>
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
