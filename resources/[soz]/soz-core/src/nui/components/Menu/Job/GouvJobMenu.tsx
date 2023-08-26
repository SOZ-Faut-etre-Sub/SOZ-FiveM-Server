import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type MandatoryStateProps = {
    data: {
        onDuty: boolean;
        state: {
            radar: boolean;
        };
    };
};

export const GouvJobMenu: FunctionComponent<MandatoryStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_gouv';

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
        <Menu type={MenuType.MandatoryJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.GouvAnnoncement);
                        }}
                    >
                        Faire une communication
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
