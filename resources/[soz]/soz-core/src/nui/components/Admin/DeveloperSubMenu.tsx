import { FunctionComponent, useEffect, useState } from 'react';

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

export const DeveloperSubMenu: FunctionComponent<DeveloperSubMenuProps> = ({ banner, state, updateState }) => {
    const [noClip, setNoClip] = useState<boolean>(false);
    const [displayCoords, setDisplayCoords] = useState<boolean>(false);

    useEffect(() => {
        if (state && state.noClip !== undefined) {
            setNoClip(state.noClip);
        }
        if (state && state.displayCoords !== undefined) {
            setDisplayCoords(state.displayCoords);
        }
    }, [state]);

    // TODO: Move to a shared file
    const coordOptions = [
        { label: 'Vector 3', value: 'coords3' },
        { label: 'Vector 4', value: 'coords4' },
    ];

    return (
        <SubMenu id="developer">
            <MenuTitle banner={banner}>Si véloces ces développeurs</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={noClip}
                    onChange={async value => {
                        setNoClip(value);
                        updateState('developer', 'noClip', value);
                        await fetchNui(NuiEvent.AdminToggleNoClip, {});
                    }}
                >
                    No clip
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={displayCoords}
                    onChange={async value => {
                        setDisplayCoords(value);
                        updateState('developer', 'displayCoords', value);
                        await fetchNui(NuiEvent.AdminToggleShowCoordinates, value);
                    }}
                >
                    Afficher les coordonnées
                </MenuItemCheckbox>
                <MenuItemSelect
                    title="Copier les coords"
                    onConfirm={async selectedIndex => {
                        await fetchNui(NuiEvent.AdminCopyCoords, coordOptions[selectedIndex].value);
                    }}
                >
                    {coordOptions.map(option => (
                        <MenuItemSelectOption key={option.value}>{option.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminChangePlayer);
                    }}
                >
                    Changer de joueur
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
