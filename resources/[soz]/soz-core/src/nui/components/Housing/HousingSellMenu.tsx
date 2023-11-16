import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { getResellPrice, Property } from '../../../shared/housing/housing';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type HousingSellMenuProps = {
    data?: Property;
};

export const HousingSellMenu: FunctionComponent<HousingSellMenuProps> = ({ data }) => {
    const player = usePlayer();

    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.HousingSellMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_habitation"></MenuTitle>
                <MenuContent>
                    {data.apartments.map(apartment => {
                        if (apartment.owner !== player.citizenid) {
                            return null;
                        }

                        return (
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.HousingSell, {
                                        apartmentId: apartment.id,
                                        propertyId: data.id,
                                    });
                                }}
                                key={apartment.id}
                            >
                                <div className="pr-2 flex items-center justify-between">
                                    <span>{apartment.label}</span>
                                    <span>
                                        💸 ${Intl.NumberFormat('fr-FR').format(getResellPrice(apartment, data))}
                                    </span>
                                </div>
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
