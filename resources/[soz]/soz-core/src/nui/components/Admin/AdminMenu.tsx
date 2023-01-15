import { FunctionComponent } from 'react';

import { AdminMenuData } from '../../../shared/admin/admin';
import { MenuType } from '../../../shared/nui/menu';
import { MainMenu, Menu, MenuContent, MenuItemSubMenuLink, MenuTitle } from '../Styleguide/Menu';
import { DeveloperSubMenu } from './DeveloperSubMenu';
import { GameMasterSubMenu } from './GamemasterSubMenu';
import { InteractiveSubMenu } from './InteractiveSubMenu';
import { JobSubMenu } from './JobSubMenu';
import { PlayerSubMenu } from './PlayerSubMenu';
import { SkinSubMenu } from './SkinSubMenu';
import { VehicleSubMenu } from './VehicleSubMenu';

export type AdminMenuStateProps = {
    data?: AdminMenuData;
};

export const AdminMenu: FunctionComponent<AdminMenuStateProps> = ({ data }) => {
    if (!data || !data.state) {
        return null;
    }

    const isStaffOrAdmin = ['staff', 'admin'].includes(data.permission);

    return (
        <Menu type={MenuType.AdminMenu}>
            <MainMenu>
                <MenuTitle banner={data.banner}>Menu des admins</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="game_master">🎲 Menu du maître du jeu</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="interactive">🗺 Informations interactives</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="job">
                        ⛑ Gestion métier
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="skin">🐕 Modification du style du joueur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="vehicle">
                        🚗 Gestion du véhicule
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="players">👨‍💻 Gestion des joueurs</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="developer">🛠 Outils pour développeur</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <GameMasterSubMenu
                characters={data.characters}
                banner={data.banner}
                permission={data.permission}
                state={data.state.gameMaster}
            />
            <InteractiveSubMenu banner={data.banner} state={data.state.interactive} />
            <JobSubMenu banner={data.banner} />
            <SkinSubMenu banner={data.banner} state={data.state.skin} />
            <VehicleSubMenu banner={data.banner} permission={data.permission} />
            <PlayerSubMenu banner={data.banner} permission={data.permission} />
            <DeveloperSubMenu banner={data.banner} state={data.state.developer} />
        </Menu>
    );
};
