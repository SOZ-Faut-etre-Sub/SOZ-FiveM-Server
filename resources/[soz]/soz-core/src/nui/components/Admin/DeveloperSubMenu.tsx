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

export type DeveloperSubMenuProps = {
    banner: string;
    state: {
        noClip: boolean;
        displayCoords: boolean;
    };
};

const coordOptions = [
    { label: 'Vector 3', value: 'coords3' },
    { label: 'Vector 4', value: 'coords4' },
];

export const DeveloperSubMenu: FunctionComponent<DeveloperSubMenuProps> = ({ banner, state }) => {
    return (
        <SubMenu id="developer">
            <MenuTitle banner={banner}>Si véloces ces développeurs</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={state.noClip}
                    onChange={async () => {
                        await fetchNui(NuiEvent.AdminToggleNoClip);
                    }}
                >
                    No clip
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={state.displayCoords}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminToggleShowCoordinates, value);
                    }}
                >
                    Afficher les coordonnées
                </MenuItemCheckbox>
                <MenuItemSelect
                    title="📋 Copier les coords"
                    onConfirm={async selectedIndex => {
                        await fetchNui(NuiEvent.AdminCopyCoords, coordOptions[selectedIndex].value);
                    }}
                >
                    {coordOptions.map(option => (
                        <MenuItemSelectOption key={'copy_coords_' + option.value}>{option.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminChangePlayer);
                    }}
                >
                    🧑 Changer de joueur
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminResetHealthData);
                    }}
                >
                    Redonner la faim/soif
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminCreateZone);
                    }}
                >
                    Créer une zone
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
