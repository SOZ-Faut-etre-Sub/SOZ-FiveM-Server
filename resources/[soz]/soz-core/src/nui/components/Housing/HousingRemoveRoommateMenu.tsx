import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { Property } from '../../../shared/housing/housing';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type HousingRemoveRoommateMenuProps = {
    data?: Property;
};

export const HousingRemoveRoommateMenu: FunctionComponent<HousingRemoveRoommateMenuProps> = ({ data }) => {
    const player = usePlayer();

    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.HousingRemoveRoommateMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_habitation"></MenuTitle>
                <MenuContent>
                    {data.apartments.map(apartment => {
                        if (apartment.owner !== player.citizenid || apartment.roommate === null) {
                            return null;
                        }

                        return (
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.HousingRemoveRoommate, {
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
