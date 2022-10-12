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
    updateState: (namespace: 'developer', key: keyof DeveloperSubMenuProps['state'], value: any) => void;
    state: {
        noClip: boolean;
        displayCoords: boolean;
    };
};

const coordOptions = [
    { label: 'Vector 3', value: 'coords3' },
    { label: 'Vector 4', value: 'coords4' },
];

export const DeveloperSubMenu: FunctionComponent<DeveloperSubMenuProps> = ({ banner, state, updateState }) => {
    return (
        <SubMenu id="developer">
            <MenuTitle banner={banner}>Si véloces ces développeurs</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={state.noClip}
                    onChange={async value => {
                        updateState('developer', 'noClip', value);
                        await fetchNui(NuiEvent.AdminToggleNoClip);
                    }}
                >
                    No clip
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={state.displayCoords}
                    onChange={async value => {
                        updateState('developer', 'displayCoords', value);
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
            </MenuContent>
        </SubMenu>
    );
};
