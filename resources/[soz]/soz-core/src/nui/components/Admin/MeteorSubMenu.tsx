import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    banner: string;
    state: MeteorSubMenuState;
};

export const MeteorSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ banner, state }) => {
    return (
        <SubMenu id="meteor">
            <MenuTitle banner={banner}>Juste un rond ...</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title={`Sirène`}
                    value={state.siren}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorSiren, index);
                    }}
                >
                    {Array(11)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`siren_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={`Musique`}
                    value={state.music}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, index);
                    }}
                >
                    {Array(11)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`music_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorActivate);
                    }}
                >
                    Lancement du Météore
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorKickPlayers);
                    }}
                >
                    Expulser les joueurs
                </MenuItemButton>
                <MenuItemCheckbox
                    checked={state.disableNpc}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuMeteorDisableNpc, value);
                    }}
                >
                    Désactiver le spawn de PNJ
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
