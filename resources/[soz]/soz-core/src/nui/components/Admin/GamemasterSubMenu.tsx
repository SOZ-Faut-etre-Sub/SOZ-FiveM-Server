import { FunctionComponent, useEffect, useState } from 'react';

import { LICENCES, MONEY_OPTIONS } from '../../../shared/admin/admin';
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

export type GameMasterSubMenuProps = {
    banner: string;
    updateState: (namespace: 'gameMaster', key: keyof GameMasterSubMenuProps['state'], value: any) => void;
    state: {
        moneyCase: boolean;
        invisible: boolean;
        invincible: boolean;
        godMode: boolean;
    };
};

export const GameMasterSubMenu: FunctionComponent<GameMasterSubMenuProps> = ({ banner, state, updateState }) => {
    const [moneyCase, setMoneyCase] = useState<boolean>(false);
    const [invisible, setInvisible] = useState<boolean>(false);
    const [invincible, setInvincible] = useState<boolean>(false);
    const [godMode, setGodMode] = useState<boolean>(false);

    useEffect(() => {
        if (state && state.moneyCase !== undefined) {
            setMoneyCase(state.moneyCase);
        }
        if (state && state.invisible !== undefined) {
            setInvisible(state.invisible);
        }
        if (state && state.invincible !== undefined) {
            setInvincible(state.invincible);
        }
        if (state && state.godMode !== undefined) {
            setGodMode(state.godMode);
        }
    }, [state]);

    return (
        <SubMenu id="game_master">
            <MenuTitle banner={banner}>Dieu ? C'est toi ?</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Se donner de l'argent propre"
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminGiveMoney, MONEY_OPTIONS[index].value);
                    }}
                >
                    {MONEY_OPTIONS.map(option => (
                        <MenuItemSelectOption key={option.value}>{option.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="Se donner de l'argent marqué"
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
                    Se téléporter au marqueur
                </MenuItemButton>
                <MenuItemSelect
                    title="Se donner le permis"
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminGiveLicence, LICENCES[index].value);
                    }}
                >
                    {LICENCES.map(licence => (
                        <MenuItemSelectOption key={licence.label}>{licence.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemCheckbox
                    checked={moneyCase}
                    onChange={async value => {
                        updateState('gameMaster', 'moneyCase', value);
                        await fetchNui(NuiEvent.AdminToggleMoneyCase, value);
                    }}
                >
                    Mallette d'argent
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={invisible}
                    onChange={async value => {
                        updateState('gameMaster', 'invisible', value);
                        await fetchNui(NuiEvent.AdminSetVisible, value);
                    }}
                >
                    Invisible
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={invincible}
                    onChange={async value => {
                        updateState('gameMaster', 'invincible', value);
                        await fetchNui(NuiEvent.AdminSetInvincible, value);
                    }}
                >
                    Invincible
                </MenuItemCheckbox>
                <MenuItemButton>Auto-pilote</MenuItemButton>
                <MenuItemCheckbox
                    checked={godMode}
                    onChange={async value => {
                        updateState('gameMaster', 'godMode', value);
                        await fetchNui(NuiEvent.AdminSetGodMode, value);
                    }}
                >
                    God mode
                </MenuItemCheckbox>
                <MenuItemButton>Se libérer des menottes</MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
