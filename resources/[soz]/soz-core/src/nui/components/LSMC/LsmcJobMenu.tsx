import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { FunctionComponent } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
} from '../Styleguide/Menu';

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
                <MenuContent>
                    <MenuItemSelect
                        onConfirm={(index, value) => {
                            fetchNui(NuiEvent.ObjectPlace, value);
                        }}
                        title="🚧 Poser un objet"
                    >
                        <MenuItemSelectOption
                            value={{
                                item: 'cone',
                                props: 'prop_roadcone02a',
                            }}
                        >
                            Cône de circulation
                        </MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
