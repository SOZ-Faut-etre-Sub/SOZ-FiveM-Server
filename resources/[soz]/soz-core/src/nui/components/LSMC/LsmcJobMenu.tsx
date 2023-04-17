import { ServerEvent } from '@public/shared/event';
import { FunctionComponent } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import { triggerServerEvent } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
} from '../Styleguide/Menu';

type LSMCStateProps = {
    data: {
        onDuty: boolean;
    };
};

export const LsmcJobMenu: FunctionComponent<LSMCStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_lsmc';

    if (!data.onDuty) {
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

    const onConfirm = (item, props) => {
        triggerServerEvent(ServerEvent.JOBS_PLACE_PROPS, item, props);
    };

    return (
        <Menu type={MenuType.LsmcJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
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
                            Cône de circulation
                        </MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
