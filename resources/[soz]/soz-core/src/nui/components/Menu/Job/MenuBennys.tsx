import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui, triggerServerEvent } from '../../../fetch';
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

    if (!data) {
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

    const onConfirm = (item, props) => {
        triggerServerEvent('job:server:placeProps', item, props);
    };

    const onUpgradeVehicle = () => {
        fetchNui(NuiEvent.BennysUpgradeVehicle);
    };

    return (
        <Menu type={MenuType.JobBennys}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Services Bennys</MenuTitle>
                <MenuContent>
                    {data.insideUpgradeZone && (
                        <MenuItemButton onConfirm={onUpgradeVehicle}>🔧 Améliorer le véhicule</MenuItemButton>
                    )}
                    <MenuItemSelect
                        onConfirm={(index, value) => onConfirm(value.item, value.props)}
                        title="🚧 Poser un objet"
                    >
                        <MenuItemSelectOption
                            value={{
                                item: 'cone',
                                props: 'prop_roadcone02a',
                            }}
                        >
                            Cone de circulation
                        </MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
