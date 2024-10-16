import { SozRole } from '@core/permissions';
import { fetchNui } from '@public/nui/fetch';
import { HalloweenSubMenuState } from '@public/shared/admin/admin';
import { NuiEvent } from '@public/shared/event/nui';
import { VampireGameCollection, VampireGameCollectionLabel } from '@public/shared/halloween';
import { FunctionComponent } from 'react';

import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    banner: string;
    permission: SozRole;
    state: HalloweenSubMenuState;
};

const MOON_OPTIONS = [
    { label: 'Désactivé', value: 'off' },
    { label: 'Clear', value: 'clear' },
    { label: 'Light', value: 'light' },
    { label: 'Full', value: 'full' },
];

export const HalloweenSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ banner, permission, state }) => {
    const isAdmin = permission === 'admin';
    const isAdminOrStaff = isAdmin || permission === 'staff';

    return (
        <>
            <SubMenu id="halloween">
                <MenuTitle banner={banner}>Bouh !!!</MenuTitle>
                <MenuContent>
                    <MenuItemSelect
                        disabled={!isAdminOrStaff}
                        title="🌑 Lune de sang"
                        onConfirm={async (index, value) => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenUpdateMoon, value);
                        }}
                    >
                        {MOON_OPTIONS.map(option => (
                            <MenuItemSelectOption key={option.value} value={option.value}>
                                {option.label}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>

                    <MenuItemSubMenuLink disabled={!isAdminOrStaff} id="halloween-vampire-game">
                        Vampire Game
                    </MenuItemSubMenuLink>
                </MenuContent>
            </SubMenu>

            <SubMenu id="halloween-vampire-game">
                <MenuTitle banner={banner}>Suce un cul...</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        disabled={state.started}
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenLaunchGame);
                        }}
                    >
                        Lancement du jeu
                    </MenuItemButton>
                    <MenuItemButton
                        disabled={!state.started}
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenStopGame);
                        }}
                    >
                        Arrêt du jeu
                    </MenuItemButton>

                    <MenuTitle>Paramètres</MenuTitle>
                    <MenuItemButton
                        description="Durée du jeu en minutes"
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenUpdateGameDuration);
                        }}
                    >
                        <div className="pr-2 flex items-center justify-between">
                            <span>Durée maximum de la partie</span>
                            <span>{state.gameDuration} minutes</span>
                        </div>
                    </MenuItemButton>

                    <MenuTitle>Rôles</MenuTitle>
                    {Object.entries(state.roleMaxNumber).map(([role, amount]) => (
                        <MenuItemButton
                            key={role}
                            description={`Nombre maximum de ${role}`}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuHalloweenUpdateRole, role);
                            }}
                        >
                            <div className="pr-2 flex items-center justify-between">
                                <span>{role}</span>
                                <span>{amount}</span>
                            </div>
                        </MenuItemButton>
                    ))}

                    <MenuTitle>Objectif des mortels</MenuTitle>
                    {Object.entries(state.mortalObjective).map(([collection, amount]) => (
                        <MenuItemButton
                            key={collection}
                            description={`Props pour l'action: ${VampireGameCollectionLabel(collection as VampireGameCollection)}`}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuHalloweenUpdateMortalCollection, collection);
                            }}
                        >
                            <div className="pr-2 flex items-center justify-between">
                                <span>{collection}</span>
                                <span>{amount}</span>
                            </div>
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </SubMenu>
        </>
    );
};
