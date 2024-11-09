import { usePlayer } from '@public/nui/hook/data';
import { FunctionComponent } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import { MainMenu, Menu, MenuContent, MenuItemText, MenuTitle } from '../Styleguide/Menu';

export const LsmcJobMenu: FunctionComponent = () => {
    const banner = 'https://nui-img/soz/menu_job_lsmc';
    const player = usePlayer();

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.LsmcJobMenu}>
                <MainMenu>
                    <MenuTitle banner={banner}></MenuTitle>
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.LsmcJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent></MenuContent>
            </MainMenu>
        </Menu>
    );
};
