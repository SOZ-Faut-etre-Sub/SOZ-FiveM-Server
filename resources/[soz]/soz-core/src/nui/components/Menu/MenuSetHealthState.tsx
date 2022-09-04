import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { PlayerMetadata } from '../../../shared/player';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type MenuSetHealthStateProps = {
    source: number;
};

export const MenuSetHealthState: FunctionComponent<MenuSetHealthStateProps> = ({ source }) => {
    const createSetHealthBookField = (field: keyof PlayerMetadata) => {
        return async () => {
            fetchNui(NuiEvent.PlayerSetHealthBookField, {
                field,
                source,
            });
        };
    };

    return (
        <Menu type={MenuType.SetHealthState}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_job_lsmc">Carnet de santé</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_health_level')}>
                        Définir l'état de santé
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_max_stamina')}>
                        Définir l'endurance
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_strength')}>
                        Définir la force
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_stress_level')}>
                        Définir l'état de stress
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_sugar')}>
                        Définir le taux de glucide
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_fiber')}>
                        Définir le taux de fibres
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_lipid')}>
                        Définir le taux de lipide
                    </MenuItemButton>
                    <MenuItemButton onConfirm={createSetHealthBookField('health_book_protein')}>
                        Définir le taux de protéine
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
