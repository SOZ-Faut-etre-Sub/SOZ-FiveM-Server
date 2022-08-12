import { FunctionComponent } from 'react';

import {
    MenuContainer,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

export const MenuSetHealthState: FunctionComponent = () => {
    return (
        <MenuContainer>
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
        </MenuContainer>
    );
};
