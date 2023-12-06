import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event';
import { JobType } from '../../../../shared/job';
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

    const banner =
        data.job === JobType.News
            ? 'https://nui-img/soz/menu_job_news'
            : '/public/images/banner/menu_job_you-news.webp';

    const jobLabel = data.job === JobType.News ? 'Twitch News' : 'You News';

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobUpw}>
                <MainMenu>
                    <MenuTitle banner={banner}>{jobLabel}</MenuTitle>
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
                <MenuTitle banner={banner}>{jobLabel}</MenuTitle>
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
                    <MenuItemSelect
                        title="Poser un objet"
                        onConfirm={(i, value) => {
                            fetchNui(NuiEvent.NewsPlaceObject, value);
                        }}
                    >
                        <MenuItemSelectOption value={{ item: 'n_fix_greenscreen', props: 'prop_ld_greenscreen_01' }}>
                            Fond vert
                        </MenuItemSelectOption>
                        <MenuItemSelectOption
                            value={{ item: 'n_fix_camera', props: 'prop_tv_cam_02', rotation: 180.0 }}
                        >
                            Caméra fixe
                        </MenuItemSelectOption>
                        <MenuItemSelectOption
                            value={{ item: 'n_fix_light', props: 'prop_kino_light_01', rotation: 180.0 }}
                        >
                            Lumière fixe
                        </MenuItemSelectOption>
                        <MenuItemSelectOption value={{ item: 'n_fix_mic', props: 'v_ilev_fos_mic' }}>
                            Micro sur pied
                        </MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
