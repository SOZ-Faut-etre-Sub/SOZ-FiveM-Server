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

export type CeremonySubMenuProps = {
    banner: string;
    state: {
        disableNpc: boolean;
    };
};

export const CeremonySubMenu: FunctionComponent<CeremonySubMenuProps> = ({ banner, state }) => {
    return (
        <SubMenu id="ceremony">
            <MenuTitle banner={banner}>Cérémonie</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={state.disableNpc}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuMeteorDisableNpc, value);
                    }}
                >
                    Désactiver le spawn de PNJ
                </MenuItemCheckbox>
                <MenuItemSelect
                    title={`Forcer l'heure`}
                    value={-1}
                    onConfirm={async (index, value) => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyTime, { value: value === -1 ? null : value });
                    }}
                >
                    <MenuItemSelectOption value={-1} key={`time_${-1}`}>
                        Reset
                    </MenuItemSelectOption>
                    {Array(24)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`time_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>

                <MenuTitle>Cérémonie parade</MenuTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyParadeStart, true);
                    }}
                >
                    Lancer la parade
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyParadeStart, false);
                    }}
                >
                    Arreter la parade
                </MenuItemButton>

                <MenuTitle>Cérémonie jeux de lumière</MenuTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuPublicCeremonyStart);
                    }}
                >
                    Lumière sur les bâtiments publics
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuFinalCeremonyStart);
                    }}
                >
                    Lumière sur la ville
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
