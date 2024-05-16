import { usePlayer } from '@public/nui/hook/data';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type FoodStateProps = {
    data: {
        displayBinBlip: boolean;
    };
};

export const GarbageJobMenu: FunctionComponent<FoodStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_garbage';
    const player = usePlayer();

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.GarbageJobMenu}>
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
        <Menu type={MenuType.GarbageJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.displayBinBlip}
                        onChange={value => {
                            fetchNui(NuiEvent.GarbageDisplayBlip, {
                                value,
                            });
                        }}
                    >
                        Afficher les points de collecte
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
