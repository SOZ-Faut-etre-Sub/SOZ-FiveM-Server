import { FunctionComponent } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

export const MenuSetHealthState: FunctionComponent = () => {
    return (
        <Menu type={MenuType.SetHealthState}>
            <MainMenu>
                <MenuTitle>Carnet de santé</MenuTitle>
                <MenuContent>
                    <MenuItemButton>Définir l'état de santé</MenuItemButton>
                    <MenuItemButton>Définir le taux de glucide</MenuItemButton>
                    <MenuItemSelect title="Test">
                        <MenuItemSelectOption>Value A</MenuItemSelectOption>
                        <MenuItemSelectOption>Value B</MenuItemSelectOption>
                        <MenuItemSelectOption>Value C</MenuItemSelectOption>
                        <MenuItemSelectOption>Value D</MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
