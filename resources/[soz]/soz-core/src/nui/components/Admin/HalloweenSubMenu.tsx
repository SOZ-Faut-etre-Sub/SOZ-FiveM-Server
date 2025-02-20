import { SozRole } from '@core/permissions';
import { fetchNui } from '@public/nui/fetch';
import { HalloweenSubMenuState } from '@public/shared/admin/admin';
import { NuiEvent } from '@public/shared/event/nui';
import { VampireGameCollection, VampireGameLabel, VampireGameObjectiveTypePart2 } from '@public/shared/halloween';
import { FunctionComponent } from 'react';

import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    permission: SozRole;
    state: HalloweenSubMenuState;
};

const MOON_OPTIONS = [
    { label: 'Désactivé', value: 'off' },
    { label: 'Clear', value: 'clear' },
    { label: 'Light', value: 'light' },
    { label: 'Full', value: 'full' },
];

export const HalloweenSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ permission, state }) => {
    const isAdmin = permission === 'admin';
    const isAdminOrStaff = isAdmin || permission === 'staff';

    return (
        <>
            <SubMenu id="halloween">
                <MenuTitle title={permission} />
                <MenuContent subtitle="Bouh !!!">
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

            <SubMenu id="halloween-vampire-game-excluded-players">
                <MenuTitle title={permission} />
                <MenuContent subtitle="Suce un cul...">
                    <MenuItemSubMenuLink disabled={!isAdminOrStaff} id="players">
                        Afficher la liste des joueurs
                    </MenuItemSubMenuLink>

                    {state.excludedPlayers.map(player => (
                        <MenuItemButton
                            key={player.citizenId}
                            description="Supprimer l'exclusion du joueur"
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuHalloweenUpdateGamePlayerExclusion, {
                                    citizenId: player.citizenId,
                                    enabled: false,
                                });
                            }}
                        >
                            {player.name}
                        </MenuItemButton>
                    ))}
                    {state.excludedPlayers.length === 0 && <MenuItemText>Aucun joueur exclu</MenuItemText>}
                </MenuContent>
            </SubMenu>

            <SubMenu id="halloween-vampire-game">
                <MenuTitle title={permission} />
                <MenuContent subtitle="Suce un cul...">
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

                    <MenuItemSelect
                        title="Forcer son rôle"
                        description={`Remplace le rôle de l'utilisateur par le rôle sélectionné`}
                        onConfirm={async (_, value) => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenForceTransformPlayer, value);
                        }}
                    >
                        {Object.keys(state.roleMaxNumber).map(role => (
                            <MenuItemSelectOption key={role} value={role}>
                                {role}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>

                    <MenuSubTitle>Paramètres</MenuSubTitle>
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

                    <MenuItemSubMenuLink disabled={!isAdminOrStaff} id="halloween-vampire-game-excluded-players">
                        Exclure des joueurs
                    </MenuItemSubMenuLink>

                    <MenuSubTitle>Rôles</MenuSubTitle>
                    {Object.entries(state.roleMaxNumber).map(([role, amount]) => (
                        <MenuItemButton
                            key={role}
                            description={`Chance de drop en ${role}`}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuHalloweenUpdateRole, role);
                            }}
                        >
                            <div className="pr-2 flex items-center justify-between">
                                <span>{role}</span>
                                <span>{amount}%</span>
                            </div>
                        </MenuItemButton>
                    ))}

                    <MenuSubTitle>Objectif des mortels - Part I</MenuSubTitle>
                    {Object.entries(state.mortalObjectivePart1).map(([collection, amount]) => (
                        <MenuItemButton
                            key={collection}
                            description={`Props pour l'action: ${VampireGameLabel(collection as VampireGameCollection)}`}
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

                    <MenuSubTitle>Objectif des mortels - Part II</MenuSubTitle>
                    {Object.entries(state.mortalObjectivePart2).map(([objective, amount]) => (
                        <MenuItemButton
                            key={objective}
                            description={`Nombre de joueurs pour l'action: ${VampireGameLabel(objective as VampireGameObjectiveTypePart2)}`}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuHalloweenUpdateObjectivePart2, objective);
                            }}
                        >
                            <div className="pr-2 flex items-center justify-between">
                                <span>{VampireGameLabel(objective as VampireGameObjectiveTypePart2)}</span>
                                <span>{amount}</span>
                            </div>
                        </MenuItemButton>
                    ))}

                    <MenuSubTitle>Objectif des mortels - Part III</MenuSubTitle>
                    <MenuItemButton
                        description="Durée de la phase en minutes"
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenUpdateObjectivePart3);
                        }}
                    >
                        <div className="pr-2 flex items-center justify-between">
                            <span>Durée maximum de la phase</span>
                            <span>{state.mortalObjectivePart3} minutes</span>
                        </div>
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
        </>
    );
};
