import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { MenuContent, MenuItemButton, MenuItemCheckbox, MenuTitle, SubMenu } from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    banner: string;
    state: MeteorSubMenuState;
};

export const MeteorSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ banner, state }) => {
    return (
        <SubMenu id="meteor">
            <MenuTitle banner={banner}>Juste un rond ...</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={state.siren}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuMeteorToggleSiren, value);
                    }}
                >
                    Activer la sirène
                </MenuItemCheckbox>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorActivateMeteor);
                    }}
                >
                    Lancement du Météore
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorActivateMusic, true);
                    }}
                >
                    Lancement Musique
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorActivateMusic, false);
                    }}
                >
                    Arret Musique
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorKickPlayers);
                    }}
                >
                    Expulser les joueurs
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
