import { FunctionComponent } from 'react';

import { SozRole } from '../../../core/permissions';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemSubMenuLink, MenuTitle } from '../Styleguide/Menu';
import { DeveloperSubMenu, DeveloperSubMenuProps } from './DeveloperSubMenu';
import { GameMasterSubMenu, GameMasterSubMenuProps } from './GamemasterSubMenu';
import { InteractiveSubMenu, InteractiveSubMenuProps } from './InteractiveSubMenu';
import { JobSubMenu, JobSubMenuProps } from './JobSubMenu';
import { PlayerSubMenu } from './PlayerSubMenu';
import { SkinSubMenu, SkinSubMenuProps } from './SkinSubMenu';
import { VehicleSubMenu } from './VehicleSubMenu';

export type AdminMenuStateProps = {
    data: {
        banner: string;
        permission: SozRole;
        state: {
            gameMaster: GameMasterSubMenuProps['state'];
            interactive: InteractiveSubMenuProps['state'];
            job: JobSubMenuProps['state'];
            skin: SkinSubMenuProps['state'];
            developer: DeveloperSubMenuProps['state'];
        };
    };
};

export const AdminMenu: FunctionComponent<AdminMenuStateProps> = ({ data }) => {
    // const [state, setState] = useState<AdminMenuStateProps['data']['state']>(null);
    // const [banner, setBanner] = useState<string>(null);
    // const [permission, setPermission] = useState<SozRole>(null);

    // useEffect(() => {
    //     if (data && data.state) {
    //         setState(data.state);
    //     }
    //     if (data && data.banner) {
    //         setBanner(data.banner);
    //     }
    //     if (data && data.permission) {
    //         setPermission(data.permission);
    //     }
    // }, [data]);

    const updateState = async (namespace: string, key: string, value: any) => {
        data.state[namespace][key] = value;
        await fetchNui(NuiEvent.AdminUpdateState, { namespace, key, value });
    };

    if (!data.state) {
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
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="skin">
                        🐕 Modification du style du joueur
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink disabled={!isStaffOrAdmin} id="vehicle">
                        🚗 Gestion du véhicule
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="players">👨‍💻 Gestion des joueurs</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="developer">🛠 Outils pour développeur</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <GameMasterSubMenu
                banner={data.banner}
                permission={data.permission}
                updateState={updateState}
                state={data.state.gameMaster}
            />
            <InteractiveSubMenu banner={data.banner} updateState={updateState} state={data.state.interactive} />
            <JobSubMenu banner={data.banner} updateState={updateState} state={data.state.job} />
            <SkinSubMenu banner={data.banner} updateState={updateState} state={data.state.skin} />
            <VehicleSubMenu banner={data.banner} permission={data.permission} />
            <PlayerSubMenu banner={data.banner} permission={data.permission} />
            <DeveloperSubMenu banner={data.banner} state={data.state.developer} updateState={updateState} />
        </Menu>
    );
};
