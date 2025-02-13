import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { ApartmentMenuData } from '../../../shared/housing/housing';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type HousingStoreFounitureSelectMenuProps = {
    data?: ApartmentMenuData;
};

export const HousingStoreFounitureSelectMenu: FunctionComponent<HousingStoreFounitureSelectMenuProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.HousingStoreFounitureSelectMenu}>
            <MainMenu>
                <MenuTitle title="Habitation" />
                <MenuContent>
                    {data.apartments.map(apartment => {
                        return (
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.HousingStore, {
                                        apartmentId: apartment.id,
                                        propertyId: data.property.id,
                                    });
                                }}
                                key={apartment.id}
                            >
                                {apartment.label}
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
