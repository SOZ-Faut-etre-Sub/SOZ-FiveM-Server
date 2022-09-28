import { FunctionComponent, useEffect, useState } from 'react';

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
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type PlayerSubMenuProps = {
    banner: string;
};

export interface NuiAdminPlayerSubMenuMethodMap {
    SetPlayers: AdminPlayer[];
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

export const PlayerSubMenu: FunctionComponent<PlayerSubMenuProps> = ({ banner }) => {
    const [players, setPlayers] = useState<AdminPlayer[]>([]);

    useNuiEvent('admin_player_submenu', 'SetPlayers', players => {
        setPlayers(players);
    });

    useEffect(() => {
        if (players != null && players.length === 0) {
            fetchNui<never, AdminPlayer[]>(NuiEvent.AdminGetPlayers).then();
        }
    }, [players]);

    if (!players) {
        return null;
    }

    return (
        <>
            <SubMenu id="players">
                <MenuTitle banner={banner}>Michel ? C'est toi ?</MenuTitle>
                <MenuContent>
                    {players.map(player => (
                        <MenuItemSubMenuLink id={'player_' + player.cid} key={'player_link_' + player.cid}>
                            [{player.id}] {player.name}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            {players.map(player => (
                <SubMenu id={'player_' + player.cid} key={player.cid}>
                    <MenuTitle banner={banner}>{player.name}</MenuTitle>
                    <MenuContent>
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminSpectate, player);
                            }}
                        >
                            Observer le joueur
                        </MenuItemButton>
                        <MenuItemSelect
                            title={'Santé du joueur'}
                            onConfirm={async selectedIndex => {
                                await fetchNui(NuiEvent.AdminHandleHealthOption, {
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
                                await fetchNui(NuiEvent.AdminHandleMovementOption, {
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
                                await fetchNui(NuiEvent.AdminHandleVocalOption, {
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
                    </MenuContent>
                </SubMenu>
            ))}
        </>
    );
};
