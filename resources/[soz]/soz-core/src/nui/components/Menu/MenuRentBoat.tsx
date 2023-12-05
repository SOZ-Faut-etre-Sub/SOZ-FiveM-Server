import { VehicleColor } from '@public/shared/vehicle/modification';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

const Colors = {
    ['Vert']: VehicleColor.MetallicGreen,
    ['Rouge']: VehicleColor.MetallicRed,
    ['Orange']: VehicleColor.MetallicOrange,
    ['Jaune']: VehicleColor.MetallicRaceYellow,
    ['Bleu']: VehicleColor.MetallicBlue,
    ['Violet']: VehicleColor.MetallicPurple,
    ['Blanc']: VehicleColor.MetallicWhite,
    ['Rose']: VehicleColor.HotPink,
};

export const MenuRentBoat: FunctionComponent = () => {
    const returnBoat = () => {
        fetchNui(NuiEvent.BoatReturn);
    };

    return (
        <Menu type={MenuType.RentBoat}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_rent_boat">Location de bateaux</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={() => returnBoat()}>Rendre le bateau</MenuItemButton>
                    <MenuItemSelect
                        title={`Louer un Marquis`}
                        value={VehicleColor.MetallicGreen}
                        onConfirm={async (index, color) => {
                            await fetchNui(NuiEvent.BoatRent, color);
                        }}
                    >
                        {Object.entries(Colors).map(([colorName, colorId]) => (
                            <MenuItemSelectOption value={colorId} key={`color_${colorId}`}>
                                {colorName}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
