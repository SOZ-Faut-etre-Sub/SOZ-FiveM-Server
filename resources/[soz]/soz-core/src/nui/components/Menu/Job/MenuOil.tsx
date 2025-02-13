import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { JobLabel } from '../../../../shared/job';
import { MenuOilData } from '../../../../shared/job/oil';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type MenuOilProps = {
    data?: MenuOilData;
};

export const MenuOil: FunctionComponent<MenuOilProps> = ({ data }) => {
    const player = usePlayer();

    if (!data || !player) {
        return null;
    }

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobOil}>
                <MainMenu>
                    <MenuTitle title={JobLabel.oil} />
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.JobOil}>
            <MainMenu>
                <MenuTitle title={JobLabel.oil} />
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.showOilFields}
                        onChange={value => {
                            fetchNui(NuiEvent.OilShowOilFields, { value });
                        }}
                    >
                        Afficher la zone de récolte sur le GPS
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showRefinery}
                        onChange={value => {
                            fetchNui(NuiEvent.OilShowRefinery, { value });
                        }}
                    >
                        Afficher la zone de raffinage sur le GPS
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showReseller}
                        onChange={value => {
                            fetchNui(NuiEvent.OilShowReseller, { value });
                        }}
                    >
                        Afficher la zone de revente sur le GPS
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
