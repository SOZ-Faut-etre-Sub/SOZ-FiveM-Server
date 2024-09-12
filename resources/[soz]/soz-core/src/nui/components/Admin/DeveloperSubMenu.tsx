import { SozRole } from '@public/core/permissions';
import { DeveloperSubMenuState } from '@public/shared/admin/admin';
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
    permission: SozRole;
    state: DeveloperSubMenuState;
};

const coordOptions = [
    { label: 'Vector 3', value: 'coords3' },
    { label: 'Vector 4', value: 'coords4' },
];

const notificationTypeOptions = [
    { label: 'Basic', value: 'basic' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Police', value: 'police' },
];

export const DeveloperSubMenu: FunctionComponent<DeveloperSubMenuProps> = ({ banner, permission, state }) => {
    const isAdmin = permission === 'admin';
    const isAdminOrStaff = isAdmin || permission === 'staff';
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
                <MenuItemCheckbox
                    checked={state.displayMileage}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminToggleShowMileage, value);
                    }}
                >
                    Afficher le kilométrage
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
                <MenuItemSelect
                    title="Déclencher une notification"
                    onConfirm={async selectedIndex => {
                        await fetchNui(NuiEvent.AdminTriggerNotification, notificationTypeOptions[selectedIndex].value);
                    }}
                >
                    {notificationTypeOptions.map(option => (
                        <MenuItemSelectOption key={'trigger_notification_' + option.value}>
                            {option.label}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
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
                <MenuItemCheckbox
                    checked={state.doors}
                    disabled={!isAdminOrStaff}
                    onChange={async value => {
                        state.doors = value;
                        await fetchNui(NuiEvent.AdminSetDoorManagement, value);
                    }}
                >
                    🚪Gestions des portes
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
