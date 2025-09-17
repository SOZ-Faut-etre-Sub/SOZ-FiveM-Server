import { VampireGameRole } from '@public/shared/halloween';
import { SenateParty } from '@public/shared/senate';
import { FunctionComponent, useEffect, useState } from 'react';

import { SozRole } from '../../../core/permissions';
import { AdminPlayer, HEALTH_OPTIONS, MOVEMENT_OPTIONS, VOCAL_OPTIONS } from '../../../shared/admin/admin';
import { NuiEvent } from '../../../shared/event';
import { isOk, Result } from '../../../shared/result';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';
import { PlayerPetSubMenu } from './PlayerPetSubMenu';

export type PlayerSubMenuProps = {
    permission: SozRole;
    parties: SenateParty[];
};

export interface NuiAdminPlayerSubMenuMethodMap {
    SetSearchFilter: string;
}

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

const SCENARIO_OPTIONS = [
    { label: 'Scenario 1', value: 'scenario1' },
    { label: 'Scenario 2', value: 'scenario2' },
    { label: 'Scenario 3', value: 'scenario3' },
    { label: 'Scenario 4', value: 'scenario4' },
];

export const PlayerSubMenu: FunctionComponent<PlayerSubMenuProps> = ({ permission, parties }) => {
    const [players, setPlayers] = useState<AdminPlayer[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>('');

    useNuiEvent('admin_player_submenu', 'SetSearchFilter', filter => {
        setSearchFilter(filter);
    });

    useEffect(() => {
        if (players != null && players.length === 0) {
            fetchNui<never, Result<AdminPlayer[], never>>(NuiEvent.AdminGetPlayers).then(result => {
                if (isOk(result)) {
                    setPlayers(result.ok);
                }
            });
        }
    }, [players]);

    if (!players) {
        return null;
    }

    const isAdminOrStaff = ['admin', 'staff'].includes(permission);
    const isAdminOrStaffOrGM = ['admin', 'staff', 'gamemaster'].includes(permission);

    return (
        <>
            <SubMenu id="players">
                <MenuTitle title={permission} />
                <MenuContent subtitle="Michel ? C'est toi ?">
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuPlayerHandleSearchPlayer);
                        }}
                    >
                        🔎 Rechercher un joueur: {searchFilter}
                    </MenuItemButton>
                    {players
                        .filter(player => {
                            if (searchFilter === '') {
                                return true;
                            }
                            const search = searchFilter.toLowerCase();
                            return (
                                player.name.toLowerCase().includes(search) ||
                                player.rpFullName.toLowerCase().includes(search)
                            );
                        })
                        .map((player, i) => (
                            <MenuItemSubMenuLink id={'player_' + player.citizenId} key={i}>
                                [{player.id}] {player.rpFullName} | {player.name}
                            </MenuItemSubMenuLink>
                        ))}
                </MenuContent>
            </SubMenu>
            {players.map((player, index) => (
                <>
                    <SubMenu id={'player_' + player.citizenId} key={`player_index_${index}`}>
                        <MenuTitle title={permission} />
                        <MenuContent subtitle={player.name}>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSpectate, player);
                                }}
                                disabled={!isAdminOrStaffOrGM}
                                description={
                                    <ul>
                                        <MenuSubTitle>Contrôle du mode observateur</MenuSubTitle>
                                        <MenuItemText> Tab : Basculer le mode caméra</MenuItemText>
                                        <MenuItemText> Retour : Quitter le mode observateur</MenuItemText>
                                        <MenuItemText> Maj Gauche : Accélérer la caméra libre</MenuItemText>
                                        <MenuItemText> Controle Gauche : Ralentir la caméra libre</MenuItemText>
                                    </ul>
                                }
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
                                title={'Debug Vocal'}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetVoipDebug, {
                                        player,
                                        value,
                                    });
                                }}
                            >
                                <MenuItemSelectOption value={true}>Activer</MenuItemSelectOption>
                                <MenuItemSelectOption value={false}>Désactiver</MenuItemSelectOption>
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
                                disabled={!isAdminOrStaff}
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
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetSkin, player);
                                }}
                            >
                                Réinitialiser le skin du joueur
                            </MenuItemButton>
                            <MenuItemButton
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSearch, player);
                                }}
                            >
                                Fouiller
                            </MenuItemButton>
                            <MenuItemSubMenuLink id={`player-pet-${player.citizenId}`}>
                                🐕 Gérer l'animal
                            </MenuItemSubMenuLink>
                            <MenuItemButton
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleOpenGunSmith, player);
                                }}
                            >
                                Ouvrir le GunSmith
                            </MenuItemButton>
                            <MenuSubTitle>Hygiène de vie</MenuSubTitle>
                            <MenuItemSelect
                                title={'Force'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                        player,
                                        attribute: 'strength',
                                        value: selectedIndex === 0 ? 'min' : 'max',
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
                                        attribute: 'stamina',
                                        value: selectedIndex === 0 ? 'min' : 'max',
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
                                        attribute: 'stress',
                                        value: selectedIndex === 0 ? 'min' : 'max',
                                    });
                                }}
                            >
                                <MenuItemSelectOption key={'stress_min_option'}>Min</MenuItemSelectOption>
                                <MenuItemSelectOption key={'stress_max_option'}>Max</MenuItemSelectOption>
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Carence'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                        player,
                                        attribute: 'deficiency',
                                        value: selectedIndex === 0 ? 'min' : 'max',
                                    });
                                }}
                            >
                                <MenuItemSelectOption key={'deficiency_option'}>Avec</MenuItemSelectOption>
                                <MenuItemSelectOption key={'no_deficiency_option'}>Sans</MenuItemSelectOption>
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Self AIO'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleSetAttribute, {
                                        player,
                                        attribute: 'all',
                                        value: selectedIndex === 0 ? 'min' : 'max',
                                    });
                                }}
                            >
                                <MenuItemSelectOption key={'aio_min_option'}>Min</MenuItemSelectOption>
                                <MenuItemSelectOption key={'aio_max_option'}>Max</MenuItemSelectOption>
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={`Blessure`}
                                value={player.injuries || 0}
                                onConfirm={async index => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleInjuriesUpdate, {
                                        player,
                                        value: index,
                                    });
                                    player.injuries = index;
                                }}
                            >
                                {Array(13)
                                    .fill(0)
                                    .map((_, index) => (
                                        <MenuItemSelectOption value={index} key={`injuries_${index}`}>
                                            {index}
                                        </MenuItemSelectOption>
                                    ))}
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Reset Halloween 2022'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetHalloween, {
                                        player,
                                        year: 'halloween2022',
                                        scenario: SCENARIO_OPTIONS[selectedIndex].value,
                                    });
                                }}
                                titleWidth={60}
                            >
                                {SCENARIO_OPTIONS.map(option => (
                                    <MenuItemSelectOption key={'scenario_option_' + option.value}>
                                        {option.label}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Reset Halloween 2023'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetHalloween, {
                                        player,
                                        year: 'halloween2023',
                                        scenario: SCENARIO_OPTIONS[selectedIndex].value,
                                    });
                                }}
                                titleWidth={60}
                            >
                                {SCENARIO_OPTIONS.map(option => (
                                    <MenuItemSelectOption key={'scenario_option_' + option.value}>
                                        {option.label}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                            <MenuItemCheckbox
                                disabled={!isAdminOrStaff}
                                checked={player.plate}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetPlate, { type: 'plate', player, value });
                                    player.plate = value;
                                }}
                            >
                                Plaque ZEVENT 2024
                            </MenuItemCheckbox>
                            <MenuItemCheckbox
                                disabled={!isAdminOrStaff}
                                checked={player.specialPlate}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetPlate, {
                                        type: 'special_plate',
                                        player,
                                        value,
                                    });
                                    player.specialPlate = value;
                                }}
                            >
                                Plaque Special ZEVENT 2024 (J.Madison)
                            </MenuItemCheckbox>
                            <MenuItemButton
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleSetReputation, player);
                                }}
                            >
                                Changer la réputation
                            </MenuItemButton>
                            <MenuItemCheckbox
                                disabled={!isAdminOrStaff}
                                checked={player.canCraftMissive}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleSetCanCraftMissive, { player, value });
                                    player.canCraftMissive = value;
                                }}
                            >
                                Représentant de Corbin
                            </MenuItemCheckbox>
                            <MenuItemButton
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetCrimi, player);
                                }}
                            >
                                Reset Criminalité
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetClientState, player);
                                }}
                            >
                                Reset Client State
                            </MenuItemButton>
                            <MenuItemSelect
                                title="Parti politique"
                                value={player.partyMember?.partyId || null}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetSenateParty, {
                                        player,
                                        value,
                                    });
                                }}
                            >
                                <MenuItemSelectOption value={null}>Aucun</MenuItemSelectOption>
                                {parties.map(party => (
                                    <MenuItemSelectOption value={party.id} key={`party_${party.id}`}>
                                        {party.name}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Reset Halloween 2022'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetHalloween, {
                                        player,
                                        year: 'halloween2022',
                                        scenario: SCENARIO_OPTIONS[selectedIndex].value,
                                    });
                                }}
                                titleWidth={60}
                            >
                                {SCENARIO_OPTIONS.map(option => (
                                    <MenuItemSelectOption key={'scenario_option_' + option.value}>
                                        {option.label}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Reset Halloween 2023'}
                                onConfirm={async selectedIndex => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetHalloween, {
                                        player,
                                        year: 'halloween2023',
                                        scenario: SCENARIO_OPTIONS[selectedIndex].value,
                                    });
                                }}
                                titleWidth={60}
                            >
                                {SCENARIO_OPTIONS.map(option => (
                                    <MenuItemSelectOption key={'scenario_option_' + option.value}>
                                        {option.label}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                            <MenuItemCheckbox
                                disabled={!isAdminOrStaff}
                                checked={player.plate}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetPlate, { type: 'plate', player, value });
                                    player.plate = value;
                                }}
                            >
                                Plaque ZEVENT 2024
                            </MenuItemCheckbox>
                            <MenuItemCheckbox
                                disabled={!isAdminOrStaff}
                                checked={player.specialPlate}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetPlate, {
                                        type: 'special_plate',
                                        player,
                                        value,
                                    });
                                    player.specialPlate = value;
                                }}
                            >
                                Plaque Special ZEVENT 2024 (J.Madison)
                            </MenuItemCheckbox>
                            <MenuItemButton
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleSetReputation, player);
                                }}
                            >
                                Changer la réputation
                            </MenuItemButton>
                            <MenuItemButton
                                disabled={!isAdminOrStaff}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetCrimi, player);
                                }}
                            >
                                Reset Criminalité
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerHandleResetClientState, player);
                                }}
                            >
                                Reset Client State
                            </MenuItemButton>
                            <MenuItemSelect
                                title="Parti politique"
                                value={player.partyMember?.partyId || null}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetSenateParty, {
                                        player,
                                        value,
                                    });
                                }}
                            >
                                <MenuItemSelectOption value={null}>Aucun</MenuItemSelectOption>
                                {parties.map(party => (
                                    <MenuItemSelectOption value={party.id} key={`party_${party.id}`}>
                                        {party.name}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                            <MenuItemSelect
                                title={'Mode zombie'}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetZombie, {
                                        player,
                                        value,
                                    });
                                }}
                            >
                                <MenuItemSelectOption value={true}>Activer</MenuItemSelectOption>
                                <MenuItemSelectOption value={false}>Désactiver</MenuItemSelectOption>
                            </MenuItemSelect>

                            <MenuSubTitle>Vampire</MenuSubTitle>
                            <MenuItemCheckbox
                                disabled={!isAdminOrStaff}
                                checked={player.vampireGameExcluded}
                                onChange={async enabled => {
                                    await fetchNui(NuiEvent.AdminMenuHalloweenUpdateGamePlayerExclusion, {
                                        citizenId: player.citizenId,
                                        enabled,
                                    });
                                    player.vampireGameExcluded = enabled;
                                }}
                            >
                                Exclure du jeu vampire
                            </MenuItemCheckbox>

                            <MenuItemSelect
                                title={'Vampire Game Role'}
                                onConfirm={async (_, value) => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerSetHalloweenRole, {
                                        player,
                                        value,
                                    });
                                }}
                            >
                                {Object.values(VampireGameRole).map(role => (
                                    <MenuItemSelectOption key={role} value={role}>
                                        {role}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>

                            <MenuSubTitle>What if</MenuSubTitle>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerResetWhatIfClan, player);
                                }}
                            >
                                Reset Clan
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuPlayerResetWhatIfInfection, player);
                                }}
                            >
                                Reset Infection
                            </MenuItemButton>
                        </MenuContent>
                    </SubMenu>
                    <PlayerPetSubMenu disabled={!isAdminOrStaff} player={player} permission={permission} />
                </>
            ))}
            <SubMenu id={'player_features'} key={'player_features'}></SubMenu>
        </>
    );
};
