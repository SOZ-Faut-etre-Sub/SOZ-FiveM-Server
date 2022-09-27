import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemSubMenuLink, MenuTitle, SubMenu } from '../Styleguide/Menu';
import { DeveloperSubMenu, DeveloperSubMenuProps } from './DeveloperSubMenu';
import { GameMasterSubMenu, GameMasterSubMenuProps } from './GamemasterSubMenu';
import { InteractiveSubMenu, InteractiveSubMenuProps } from './InteractiveSubMenu';
import { JobSubMenu, JobSubMenuProps } from './JobSubMenu';

export type AdminMenuStateProps = {
    data: {
        state: {
            gameMaster: GameMasterSubMenuProps['state'];
            interactive: InteractiveSubMenuProps['state'];
            job: JobSubMenuProps['state'];
            developer: DeveloperSubMenuProps['state'];
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
                    <MenuItemSubMenuLink id="job">Gestion métier</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="player_style">Modification du style du joueur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="vehicle">Gestion du véhicule</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="players">Gestion des joueurs</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="developer">Outils pour développeur</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <GameMasterSubMenu banner={banner} updateState={updateState} state={state.gameMaster} />
            <InteractiveSubMenu banner={banner} updateState={updateState} state={state.interactive} />
            <JobSubMenu banner={banner} updateState={updateState} state={state.job} />
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
