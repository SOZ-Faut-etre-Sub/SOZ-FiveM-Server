import { FunctionComponent } from 'react';

import { MenuType } from '../../../../shared/nui/menu';
import { triggerServerEvent } from '../../../fetch';
import { usePlayer } from '../../../hook/data';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
} from '../../Styleguide/Menu';

export const MenuBennys: FunctionComponent = () => {
    const player = usePlayer();

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.JobBennys}>
                <MainMenu>
                    <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Services Bennys</MenuTitle>
                    <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                </MainMenu>
            </Menu>
        );
    }

    const onConfirm = (item, props) => {
        triggerServerEvent('job:server:placeProps', item, props);
    };

    return (
        <Menu type={MenuType.JobBennys}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Services Bennys</MenuTitle>
                <MenuContent>
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
