import { FunctionComponent } from 'react';

import { SozRole } from '../../../core/permissions';
import { GameMasterSubMenuState, LICENCES, MONEY_OPTIONS } from '../../../shared/admin/admin';
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
    permission: SozRole;
    state: GameMasterSubMenuState;
};

export const GameMasterSubMenu: FunctionComponent<GameMasterSubMenuProps> = ({ permission, state }) => {
    const isAdmin = permission === 'admin';
    const isAdminOrStaff = isAdmin || permission === 'staff';
    const isAdminOrStaffOrHelper = isAdminOrStaff || permission === 'helper';
    const isAdminOrStaffOrGM = isAdminOrStaff || permission === 'gamemaster';
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <SubMenu id="game_master">
            <MenuTitle title={permission} />
            <MenuContent subtitle="Dieu ? C'est toi ?">
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
                <MenuItemCheckbox
                    checked={state.adminGPS}
                    disabled={!isAdminOrStaffOrGM}
                    onChange={async value => {
                        state.adminGPS = value;
                        await fetchNui(NuiEvent.AdminSetAdminGPS, value);
                    }}
                >
                    🗺 GPS permanent
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={state.adminPoliceLocator}
                    disabled={!isAdminOrStaff}
                    onChange={async value => {
                        state.adminPoliceLocator = value;
                        await fetchNui(NuiEvent.AdminSetPoliceLocator, value);
                    }}
                >
                    🗺️ Affichage des patrouilles
                </MenuItemCheckbox>
                <MenuItemButton
                    disabled={!isAdminOrStaffOrGM}
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuGameMasterArmor);
                    }}
                >
                    𐂫 Armure
                </MenuItemButton>
                <MenuItemCheckbox
                    checked={state.adminInfiniteAmmo}
                    disabled={!isAdminOrStaffOrHelper}
                    onChange={async value => {
                        state.adminInfiniteAmmo = value;
                        await fetchNui(NuiEvent.AdminSetAdminInfiniteAmmo, value);
                    }}
                >
                    🔫 Munitions infinis
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={state.adminNoRecoil}
                    disabled={!isAdminOrStaffOrHelper}
                    onChange={async value => {
                        state.adminNoRecoil = value;
                        await fetchNui(NuiEvent.AdminSetAdminNoRecoil, value);
                    }}
                >
                    🔫 Pas de recul
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
