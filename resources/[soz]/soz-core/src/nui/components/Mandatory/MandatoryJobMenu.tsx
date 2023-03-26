import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemText,
    MenuTitle,
} from '../Styleguide/Menu';

type MandatoryStateProps = {
    data: {
        onDuty: boolean;
        state: {
            radar: boolean;
        };
    };
};

export const MandatoryJobMenu: FunctionComponent<MandatoryStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_mdr';

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.MandatoryJobMenu}>
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
        <Menu type={MenuType.FightForStyleJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.state.radar}
                        onChange={async value => {
                            await fetchNui(NuiEvent.ToggleRadar, value);
                        }}
                    >
                        Afficher les radars sur le GPS
                    </MenuItemCheckbox>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RedCall);
                        }}
                    >
                        🚨 Code Rouge
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
