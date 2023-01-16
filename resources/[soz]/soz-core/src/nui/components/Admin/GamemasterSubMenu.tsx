import { PlayerCharInfo } from '@public/shared/player';
import { FunctionComponent } from 'react';

import { SozRole } from '../../../core/permissions';
import { LICENCES, MONEY_OPTIONS } from '../../../shared/admin/admin';
import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type GameMasterSubMenuProps = {
    banner: string;
    permission: SozRole;
    characters: Record<string, PlayerCharInfo>;
    state: {
        moneyCase: boolean;
        invisible: boolean;
    };
};

export const GameMasterSubMenu: FunctionComponent<GameMasterSubMenuProps> = ({
    characters,
    banner,
    permission,
    state,
}) => {
    const isAdmin = permission === 'admin';
    const isAdminOrStaff = isAdmin || permission === 'staff';
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <SubMenu id="game_master">
            <MenuTitle banner={banner}>Dieu ? C'est toi ?</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="💰 Se donner de l'argent propre"
                    disabled={!isAdmin}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminGiveMoney, MONEY_OPTIONS[index].value);
                    }}
                >
                    {MONEY_OPTIONS.map(option => (
                        <MenuItemSelectOption key={option.value}>{option.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="💰 Se donner de l'argent marqué"
                    disabled={!isAdmin}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminGiveMarkedMoney, MONEY_OPTIONS[index].value);
                    }}
                >
                    {MONEY_OPTIONS.map(option => (
                        <MenuItemSelectOption key={option.value}>{option.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminTeleportToWaypoint);
                    }}
                >
                    🥷 Se téléporter au marqueur
                </MenuItemButton>
                <MenuItemSelect
                    title="Se donner le permis"
                    disabled={!isAdmin}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminGiveLicence, LICENCES[index].value);
                    }}
                >
                    {LICENCES.map(licence => (
                        <MenuItemSelectOption key={licence.label}>{licence.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemCheckbox
                    checked={state.moneyCase}
                    disabled={!isAdmin}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminToggleMoneyCase, value);
                    }}
                >
                    💼 Mallette d'argent
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={state.invisible}
                    disabled={!isAdmin}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminSetVisible, !value);
                    }}
                >
                    Invisible
                </MenuItemCheckbox>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminAutoPilot);
                    }}
                >
                    🏎️ Auto-pilote
                </MenuItemButton>
                <MenuItemCheckbox
                    checked={player.metadata.godmode}
                    disabled={!isAdmin}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminSetGodMode, value);
                    }}
                >
                    🔱 Mode Dieu
                </MenuItemCheckbox>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuGameMasterUncuff);
                    }}
                >
                    Se libérer des menottes
                </MenuItemButton>
                {Object.keys(characters).length > 0 && (
                    <MenuItemSelect
                        disabled={!isAdminOrStaff}
                        onConfirm={async (index, value) => {
                            await fetchNui(NuiEvent.AdminMenuGameMasterSwitchCharacter, value);
                        }}
                        title="Changer de personnage"
                    >
                        {Object.keys(characters).map(citizenId => (
                            <MenuItemSelectOption key={citizenId} value={citizenId}>
                                {characters[citizenId].firstname} {characters[citizenId].lastname}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                )}
                <MenuItemButton
                    disabled={!isAdminOrStaff}
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuGameMasterCreateNewCharacter);
                    }}
                >
                    Créer nouveau personnage
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
