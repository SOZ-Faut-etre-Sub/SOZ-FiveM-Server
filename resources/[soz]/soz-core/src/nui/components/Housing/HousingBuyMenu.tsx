import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { Property } from '../../../shared/housing/housing';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type HousingBuyMenuProps = {
    data?: Property;
};

export const HousingBuyMenu: FunctionComponent<HousingBuyMenuProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.HousingBuyMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_habitation"></MenuTitle>
                <MenuContent>
                    {data.apartments.map(apartment => {
                        if (apartment.owner !== null) {
                            return null;
                        }

                        return (
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.HousingBuy, {
                                        apartmentId: apartment.id,
                                        propertyId: data.id,
                                    });
                                }}
                                key={apartment.id}
                            >
                                <div className="pr-2 flex items-center justify-between">
                                    <span>{apartment.label}</span>
                                    <span>💸 ${apartment.price}</span>
                                </div>
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
