import { FunctionComponent, useEffect, useState } from 'react';

import { SozRole } from '../../../core/permissions';
import { AdminPlayer } from '../../../shared/admin/admin';
import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type PlayerSubMenuProps = {
    banner: string;
    permission: SozRole;
};

export interface NuiAdminPlayerSubMenuMethodMap {
    SetPlayers: AdminPlayer[];
    SetSearchFilter: string;
}

export const HEALTH_OPTIONS = [
    { label: 'Tuer', value: 'kill' },
    { label: 'Réanimer', value: 'revive' },
];

export const MOVEMENT_OPTIONS = [
    { label: 'Bloquer', value: 'freeze' },
    { label: 'Débloquer', value: 'unfreeze' },
];

export const VOCAL_OPTIONS = [
    { label: 'Status', value: 'status' },
    { label: 'Muter', value: 'mute' },
    { label: 'Démuter', value: 'unmute' },
];

export const TELEPORT_OPTIONS = [
    { label: 'Vers le joueur', value: 'goto' },
    { label: 'Du joueur à moi', value: 'bring' },
];

export const EFFECTS_OPTIONS = [
    { label: 'Alcoolique', value: 'alcohol' },
    { label: 'Drogué', value: 'drug' },
    { label: 'Normal', value: 'normal' },
];

export const DISEASE_OPTIONS = [
    { label: 'Rhume', value: 'rhume' },
    { label: 'Grippe', value: 'grippe' },
    { label: 'Intoxication', value: 'intoxication' },
    { label: 'Rougeur', value: 'rougeur' },
    { label: 'Mal au dos', value: 'backpain' },
    { label: 'Soigner', value: false },
];

export const PlayerSubMenu: FunctionComponent<PlayerSubMenuProps> = ({ banner, permission }) => {
    const [players, setPlayers] = useState<AdminPlayer[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>('');

    useNuiEvent('admin_player_submenu', 'SetPlayers', players => {
        setPlayers(players);
    });

    useNuiEvent('admin_player_submenu', 'SetSearchFilter', filter => {
        setSearchFilter(filter);
    });

    useEffect(() => {
        if (players != null && players.length === 0) {
            fetchNui<never, AdminPlayer[]>(NuiEvent.AdminGetPlayers).then();
        }
    }, [players]);

    if (!players) {
        return null;
    }

    const isAdminOrHelper = ['admin', 'helper'].includes(permission);

    return (
        <>
            <SubMenu id="players">
                <MenuTitle banner={banner}>Michel ? C'est toi ?</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuPlayerHandleSearchPlayer);
                        }}
                    >
                        🔎 Rechercher un joueur: {searchFilter}
                    </MenuItemButton>
                    {players
                        .filter(player =>
                            searchFilter !== '' ? player.name.toLowerCase().includes(searchFilter.toLowerCase()) : true
                        )
                        .map(player => (
                            <MenuItemSubMenuLink
                                id={'player_' + player.citizenId}
                                key={'player_link_' + player.citizenId}
                            >
                                [{player.id}] {player.name}
                            </MenuItemSubMenuLink>
                        ))}
                </MenuContent>
            </SubMenu>
            {players.map(player => (
                <SubMenu id={'player_' + player.citizenId} key={player.citizenId}>
                    <MenuTitle banner={banner}>{player.name}</MenuTitle>
                    <MenuContent>
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuPlayerSpectate, player);
                            }}
                        >
                            Observer le joueur
                        </MenuItemButton>
                        <MenuItemSelect
                            title={'Santé du joueur'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleHealthOption, {
                                    action: HEALTH_OPTIONS[selectedIndex].value,
                                    player,
                                });
                            }}
                        >
                            {HEALTH_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'health_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Mouvement du joueur'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleMovementOption, {
                                    action: MOVEMENT_OPTIONS[selectedIndex].value,
                                    player,
                                });
                            }}
                        >
                            {MOVEMENT_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'movement_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Vocal en jeu'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleVocalOption, {
                                    action: VOCAL_OPTIONS[selectedIndex].value,
                                    player,
                                });
                            }}
                        >
                            {VOCAL_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'vocal_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Téléportation'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleTeleportOption, {
                                    action: TELEPORT_OPTIONS[selectedIndex].value,
                                    player,
                                });
                            }}
                        >
                            {TELEPORT_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'teleport_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Effets'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleEffectsOption, {
                                    action: EFFECTS_OPTIONS[selectedIndex].value,
                                    player,
                                });
                            }}
                        >
                            {EFFECTS_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'effects_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Rendre malade'}
                            disabled={!isAdminOrHelper}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleDiseaseOption, {
                                    action: DISEASE_OPTIONS[selectedIndex].value,
                                    player,
                                });
                            }}
                        >
                            {DISEASE_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'disease_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemButton
                            disabled={!isAdminOrHelper}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleResetSkin, player);
                            }}
                        >
                            Réinitialiser le skin du joueur
                        </MenuItemButton>
                        <MenuItemText>Hygiène de vie</MenuItemText>
                        <MenuItemSelect
                            title={'Force'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                    player,
                                    attribute: 'strength',
                                    value: selectedIndex === 0 ? 0 : 150,
                                });
                            }}
                        >
                            <MenuItemSelectOption key={'strength_min_option'}>Min</MenuItemSelectOption>
                            <MenuItemSelectOption key={'strength_max_option'}>Max</MenuItemSelectOption>
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Endurance'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                    player,
                                    attribute: 'max_stamina',
                                    value: selectedIndex === 0 ? 0 : 150,
                                });
                            }}
                        >
                            <MenuItemSelectOption key={'stamina_min_option'}>Min</MenuItemSelectOption>
                            <MenuItemSelectOption key={'stamina_max_option'}>Max</MenuItemSelectOption>
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Stress'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                    player,
                                    attribute: 'stress_level',
                                    value: selectedIndex === 0 ? 0 : 100,
                                });
                            }}
                        >
                            <MenuItemSelectOption key={'stress_min_option'}>Min</MenuItemSelectOption>
                            <MenuItemSelectOption key={'stress_max_option'}>Max</MenuItemSelectOption>
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={'Carence'}
                            onConfirm={async selectedIndex => {
                                ['fiber', 'lipid', 'sugar', 'protein'].map(
                                    async attribute =>
                                        await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                            player,
                                            attribute,
                                            value: selectedIndex === 0 ? 0 : 200,
                                        })
                                );
                            }}
                        >
                            <MenuItemSelectOption key={'deficiency_option'}>Avec</MenuItemSelectOption>
                            <MenuItemSelectOption key={'no_deficiency_option'}>Sans</MenuItemSelectOption>
                        </MenuItemSelect>
                    </MenuContent>
                </SubMenu>
            ))}
            <SubMenu id={'player_features'} key={'player_features'}></SubMenu>
        </>
    );
};
