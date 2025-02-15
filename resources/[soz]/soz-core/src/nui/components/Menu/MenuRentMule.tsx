import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { useGetPrice } from '@public/nui/hook/price';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { MuleRentDeposite, MuleRentPrice } from '@public/shared/shop/zkea_fourniture';
import { TaxType } from '@public/shared/tax';
import { FunctionComponent } from 'react';

export const MenuRentMule: FunctionComponent = () => {
    const getPrice = useGetPrice();

    return (
        <Menu type={MenuType.RentMule}>
            <MainMenu>
                <MenuTitle banner="https://soz.zerator.com/static/game/images/banner/menu_rant_mule.webp">
                    Location de camion de déménagement
                </MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={async () => await fetchNui(NuiEvent.MuleReturn)}>
                        Rendre le camion
                    </MenuItemButton>
                    <MenuItemButton onConfirm={async () => await fetchNui(NuiEvent.MuleRent)}>
                        <div className="flex justify-between items-center">
                            <span>Louer un camion (Caution : ${MuleRentDeposite})</span>
                            <span className="mr-1">${getPrice(MuleRentPrice + MuleRentDeposite, TaxType.SERVICE)}</span>
                        </div>
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
