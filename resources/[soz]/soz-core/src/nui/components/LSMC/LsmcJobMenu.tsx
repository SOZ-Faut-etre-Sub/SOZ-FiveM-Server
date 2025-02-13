import { usePlayer } from '@public/nui/hook/data';
import { FunctionComponent } from 'react';

import { JobLabel } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { MainMenu, Menu, MenuContent, MenuItemText, MenuTitle } from '../Styleguide/Menu';

export const LsmcJobMenu: FunctionComponent = () => {
    const player = usePlayer();

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.LsmcJobMenu}>
                <MainMenu>
                    <MenuTitle title={JobLabel.lsmc} />
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
                <MenuTitle title={JobLabel.lsmc} />
                <MenuContent></MenuContent>
            </MainMenu>
        </Menu>
    );
};
