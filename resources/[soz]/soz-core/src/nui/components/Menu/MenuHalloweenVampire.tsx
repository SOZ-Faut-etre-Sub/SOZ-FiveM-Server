import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

export const MenuHalloweenVampire: FunctionComponent = () => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <Menu type={MenuType.HalloweenVampire}>
            <MainMenu>
                <MenuTitle title="Halloween" />
                <MenuContent>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.HalloweenVampireSwitchModel, 'vampire');
                        }}
                    >
                        Forme de Vampire
                    </MenuItemButton>

                    <MenuItemButton
                        description={`Appuyez sur "Shift gauche" pour décoller`}
                        onConfirm={() => {
                            fetchNui(NuiEvent.HalloweenVampireSwitchModel, 'crow');
                        }}
                    >
                        Forme de Corbeau
                    </MenuItemButton>

                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.HalloweenVampireSwitchModel, 'wolf');
                        }}
                    >
                        Forme de Panthère
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
