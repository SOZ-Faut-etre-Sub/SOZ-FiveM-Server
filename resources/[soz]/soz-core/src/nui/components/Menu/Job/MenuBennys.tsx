import { LSCustomMode } from '@public/shared/vehicle/vehicle';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { JobLabel } from '../../../../shared/job';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type MenuBennysProps = {
    data: {
        insideUpgradeZone: boolean;
    };
};

export const MenuBennys: FunctionComponent<MenuBennysProps> = ({ data }) => {
    const player = usePlayer();

    if (!data || !player) {
        return null;
    }

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobBennys}>
                <MainMenu>
                    <MenuTitle title={JobLabel.bennys} />
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.JobBennys}>
            <MainMenu>
                <MenuTitle title={JobLabel.bennys} />
                <MenuContent>
                    {data.insideUpgradeZone && (
                        <MenuItemButton
                            onConfirm={() => fetchNui(NuiEvent.BennysUpgradeVehicle, LSCustomMode.NewGahray)}
                        >
                            🔧 Améliorer le véhicule
                        </MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
