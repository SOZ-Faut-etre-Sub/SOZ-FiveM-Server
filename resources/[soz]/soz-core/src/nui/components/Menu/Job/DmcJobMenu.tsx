import { DmcJobMenuData } from '@public/shared/job/dmc';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type DmcStateProps = {
    data: DmcJobMenuData;
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
                    <MenuItemCheckbox
                        checked={data.blipState['job:dmc:iron_mine']}
                        onChange={value => {
                            fetchNui(NuiEvent.DmcToggleBlip, { blip: 'job:dmc:iron_mine', value });
                        }}
                    >
                        Afficher la mine de fer
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.blipState['job:dmc:aluminium_mine']}
                        onChange={value => {
                            fetchNui(NuiEvent.DmcToggleBlip, { blip: 'job:dmc:aluminium_mine', value });
                        }}
                    >
                        Afficher la mine d'aluminium
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.blipState['job:dmc:resell']}
                        onChange={value => {
                            fetchNui(NuiEvent.DmcToggleBlip, { blip: 'job:dmc:resell', value });
                        }}
                    >
                        Afficher le point de revente de métaux
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
