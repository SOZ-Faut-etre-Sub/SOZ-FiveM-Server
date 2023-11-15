import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { Property } from '../../../shared/housing/housing';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type HousingVisitMenuProps = {
    data?: Property;
};

export const HousingVisitMenu: FunctionComponent<HousingVisitMenuProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.HousingVisitMenu}>
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
                                    fetchNui(NuiEvent.HousingVisit, {
                                        apartmentId: apartment.id,
                                        propertyId: data.id,
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
