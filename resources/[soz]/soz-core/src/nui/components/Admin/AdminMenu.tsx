import { CeremonySubMenu } from '@public/nui/components/Admin/CeremonySubMenu';
import { EventSubMenu } from '@public/nui/components/Admin/EventSubMenu';
import { HalloweenSubMenu } from '@public/nui/components/Admin/HalloweenSubMenu';
import { RootState } from '@public/nui/store';
import { AdminMenuData } from '@public/shared/admin/admin';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { MainMenu, Menu, MenuContent, MenuItemSubMenuLink, MenuTitle } from '../Styleguide/Menu';
import { CharacterSubMenu } from './CharacterSubMenu';
import { DeveloperSubMenu } from './DeveloperSubMenu';
import { GameMasterSubMenu } from './GamemasterSubMenu';
import { InteractiveSubMenu } from './InteractiveSubMenu';
import { JobSubMenu } from './JobSubMenu';
import { MeteorSubMenu } from './MeteorSubMenu';
import { PlayerSubMenu } from './PlayerSubMenu';
import { SkinSubMenu } from './SkinSubMenu';
import { VehicleSubMenu } from './VehicleSubMenu';

export type AdminMenuStateProps = {
    data?: AdminMenuData;
};

export const AdminMenu: FunctionComponent<AdminMenuStateProps> = ({ data }) => {
    const isHalloween = useSelector((state: RootState) => state.features.Halloween);

    if (!data || !data.state) {
        return null;
    }

    const isStaffOrAdmin = ['staff', 'admin'].includes(data.permission);
    const isStaffOrAdminOrGM = ['staff', 'admin', 'gamemaster'].includes(data.permission);

    return (
        <Menu type={MenuType.AdminMenu}>
            <MainMenu>
                <MenuTitle banner={data.banner}>Menu des admins</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="game_master">🎲 Menu du maître du jeu</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdminOrGM} id="interactive">
                        🗺 Informations interactives
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="job">
                        ⛑ Gestion métier
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="skin">🐕 Modification du style du joueur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdminOrGM} id="vehicle">
                        🚗 Gestion du véhicule
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="players">👨‍💻 Gestion des joueurs</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdminOrGM} id="character">
                        👨‍💼 Gestion des personnages
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="meteor">
                        ☄️ Météorite
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="ceremony">
                        🎉 Cérémonie
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdminOrGM} id="event">
                        📅 Gestion des evenements HC
                    </MenuItemSubMenuLink>
                    {isHalloween && (
                        <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="halloween">
                            🎃 Halloween
                        </MenuItemSubMenuLink>
                    )}
                    <MenuItemSubMenuLink id="developer">🛠 Outils pour développeur</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <GameMasterSubMenu banner={data.banner} permission={data.permission} state={data.state.gameMaster} />
            <InteractiveSubMenu banner={data.banner} state={data.state.interactive} />
            <JobSubMenu banner={data.banner} />
            <SkinSubMenu banner={data.banner} state={data.state.skin} />
            <VehicleSubMenu banner={data.banner} permission={data.permission} state={data.state.vehicule} />
            <PlayerSubMenu banner={data.banner} permission={data.permission} parties={data.parties} />
            <DeveloperSubMenu banner={data.banner} permission={data.permission} state={data.state.developer} />
            <EventSubMenu banner={data.banner} event={data.event} />
            <CharacterSubMenu banner={data.banner} characters={data.characters} />
            <MeteorSubMenu banner={data.banner} state={data.state.meteor} />
            <CeremonySubMenu banner={data.banner} state={data.state.ceremony} />
            {isHalloween && (
                <HalloweenSubMenu banner={data.banner} permission={data.permission} state={data.state.halloween} />
            )}
        </Menu>
    );
};
