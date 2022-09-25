import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';
import { DeveloperSubMenu, DeveloperSubMenuProps } from './DeveloperSubMenu';
import { GameMasterSubMenu, GameMasterSubMenuProps } from './GamemasterSubMenu';

export type AdminMenuStateProps = {
    data: {
        state: {
            developer: DeveloperSubMenuProps['state'];
            gameMaster: GameMasterSubMenuProps['state'];
        };
    };
};

export const AdminMenu: FunctionComponent<AdminMenuStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_admin_admin';
    const [state, setState] = useState<AdminMenuStateProps['data']['state']>(null);

    useEffect(() => {
        if (data && data.state) {
            setState(data.state);
        }
    }, [data]);

    const updateState = async (namespace: string, key: string, value: any) => {
        state[namespace][key] = value;
        await fetchNui(NuiEvent.AdminUpdateState, { namespace, key, value });
    };

    if (!state) {
        return null;
    }

    return (
        <Menu type={MenuType.AdminMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Menu des admins</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="game_master">Menu du maître du jeu</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="interactive">Informations interactives</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="business">Gestion métier</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="player_style">Modification du style du joueur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="vehicle">Gestion du véhicule</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="players">Gestion des joueurs</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="developer">Outils pour développeur</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <GameMasterSubMenu banner={banner} updateState={updateState} state={state.gameMaster} />
            <SubMenu id="interactive">
                <MenuTitle banner={banner}>Des options à la carte</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox>Afficher le propriétaire des véhicules</MenuItemCheckbox>
                    <MenuItemCheckbox>Afficher le nom des joueurs</MenuItemCheckbox>
                    <MenuItemCheckbox>Afficher les joueurs sur la carte</MenuItemCheckbox>
                </MenuContent>
            </SubMenu>
            <SubMenu id="business">
                <MenuTitle banner={banner}>Pour se construire un avenir</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title="Changer de métier">
                        <MenuItemSelectOption>Bahama Unicorn</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect title="Changer de grade">
                        <MenuItemSelectOption>Employé</MenuItemSelectOption>
                        <MenuItemSelectOption>Patron</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemCheckbox>Passer en service</MenuItemCheckbox>
                </MenuContent>
            </SubMenu>
            <SubMenu id="player_style">
                <MenuTitle banner={banner}>Chien, Chat, Président...</MenuTitle>
                <MenuContent></MenuContent>
            </SubMenu>
            <SubMenu id="vehicle">
                <MenuTitle banner={banner}>ça roule vite ?</MenuTitle>
                <MenuContent></MenuContent>
            </SubMenu>
            <SubMenu id="players">
                <MenuTitle banner={banner}>Michel ? C'est toi ?</MenuTitle>
                <MenuContent></MenuContent>
            </SubMenu>
            <DeveloperSubMenu banner={banner} state={state.developer} updateState={updateState} />
        </Menu>
    );
};
