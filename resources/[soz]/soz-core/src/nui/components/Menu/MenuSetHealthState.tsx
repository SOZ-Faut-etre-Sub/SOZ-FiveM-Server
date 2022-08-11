import { FunctionComponent } from 'react';

import { MenuContainer, MenuContent, MenuItem, MenuTitle } from '../Styleguide/Menu';

export const MenuSetHealthState: FunctionComponent = () => {
    return (
        <MenuContainer>
            <MenuTitle>Carnet de santé</MenuTitle>
            <MenuContent>
                <MenuItem>Définir l'état de santé</MenuItem>
                <MenuItem>Définir le taux de glucide</MenuItem>
            </MenuContent>
        </MenuContainer>
    );
};
