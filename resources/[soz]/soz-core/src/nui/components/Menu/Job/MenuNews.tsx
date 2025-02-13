import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { JobLabel, JobType } from '../../../../shared/job';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
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

type MenuNewsProps = {
    data?: {
        job: JobType;
    };
};

export const MenuNews: FunctionComponent<MenuNewsProps> = ({ data }) => {
    const player = usePlayer();

    if (!data) {
        return null;
    }

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobUpw}>
                <MainMenu>
                    <MenuTitle title={JobLabel[data.job]} />
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.JobNews}>
            <MainMenu>
                <MenuTitle title={JobLabel[data.job]} />
                <MenuContent>
                    <MenuItemSelect
                        title="Faire une communication"
                        onConfirm={(i, value) => {
                            fetchNui(NuiEvent.NewsCreateAnnounce, {
                                type: value,
                                title: 'Message de la communication',
                            });
                        }}
                    >
                        <MenuItemSelectOption value="annonce">Annonce</MenuItemSelectOption>
                        <MenuItemSelectOption value="breaking-news">Breaking News</MenuItemSelectOption>
                        <MenuItemSelectOption value="publicité">Publicité</MenuItemSelectOption>
                        <MenuItemSelectOption value="fait-divers">Fait Divers</MenuItemSelectOption>
                        <MenuItemSelectOption value="info-trafic">Info Trafic</MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
