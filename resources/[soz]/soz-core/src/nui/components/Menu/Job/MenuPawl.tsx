import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { MenuPawlData } from '../../../../shared/nui/pawl';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type MenuPawlProps = {
    data?: MenuPawlData;
};

export const MenuPawl: FunctionComponent<MenuPawlProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_pawl';
    const player = usePlayer();

    if (!data || !player) {
        return null;
    }

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobPawl}>
                <MainMenu>
                    <MenuTitle banner={banner}>Pipe And Wooden Leg</MenuTitle>
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.JobPawl}>
            <MainMenu>
                <MenuTitle banner={banner}>Pipe And Wooden Leg</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.showFields}
                        onChange={value => {
                            fetchNui(NuiEvent.PawlShowFields, { value });
                        }}
                    >
                        Afficher la zone de récolte sur le GPS
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showResell}
                        onChange={value => {
                            fetchNui(NuiEvent.PawlShowResell, { value });
                        }}
                    >
                        Afficher la zone de revente sur le GPS
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
