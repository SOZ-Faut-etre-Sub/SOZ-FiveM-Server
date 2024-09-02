import { LSCustomMode } from '@public/shared/vehicle/vehicle';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
} from '../../Styleguide/Menu';

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
                    <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Services Bennys</MenuTitle>
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
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Services Bennys</MenuTitle>
                <MenuContent>
                    {data.insideUpgradeZone && (
                        <MenuItemButton
                            onConfirm={() => fetchNui(NuiEvent.BennysUpgradeVehicle, LSCustomMode.NewGahray)}
                        >
                            🔧 Améliorer le véhicule
                        </MenuItemButton>
                    )}
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
