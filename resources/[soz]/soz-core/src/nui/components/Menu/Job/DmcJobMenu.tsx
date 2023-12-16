import { DmcJobMenuData } from '@public/shared/job/dmc';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type DmcStateProps = {
    data: DmcJobMenuData;
};

const labels = {
    'job:dmc:iron_mine': 'Afficher la mine de fer',
    'job:dmc:aluminium_mine': "Afficher la mine d'aluminium",
    'job:dmc:uranium_mine': "Afficher la mine d'uranium",
    'job:dmc:resell': 'Afficher le point de revente de métaux',
};

export const DmcJobMenu: FunctionComponent<DmcStateProps> = ({ data }) => {
    const banner = 'https://cfx-nui-soz-core/public/images/banner/menu_job_dmc.webp';

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.DmcJobMenu}>
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
        <Menu type={MenuType.DmcJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {Object.entries(data.blipState).map(([key, checked]) => (
                        <MenuItemCheckbox
                            key={key}
                            checked={checked}
                            onChange={value => {
                                fetchNui(NuiEvent.DmcToggleBlip, { blip: key, value });
                            }}
                        >
                            {labels[key]}
                        </MenuItemCheckbox>
                    ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
