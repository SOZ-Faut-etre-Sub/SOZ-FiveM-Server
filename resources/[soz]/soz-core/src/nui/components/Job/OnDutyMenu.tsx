import { FunctionComponent } from 'react';

import { NuiJobEmployeeOnDuty } from '../../../shared/nui/job';
import { MenuType } from '../../../shared/nui/menu';
import { MainMenu, Menu, MenuContent, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type MenuJobOnDutyProps = {
    data: NuiJobEmployeeOnDuty;
};

const banners_in_core = ['dmc', 'you-news'];

export const JobOnDutyMenu: FunctionComponent<MenuJobOnDutyProps> = ({ data }) => {
    let banner;
    if (banners_in_core.includes(data.job)) {
        banner = `https://cfx-nui-soz-core/public/images/banner/menu_job_${data.job}.webp`;
    } else {
        banner = `https://nui-img/soz/menu_job_${data.job}`;
    }

    if (!data.state.length) {
        return null;
    }

    return (
        <Menu type={MenuType.JobOnDutyMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Employé(e)s en service</MenuTitle>
                <MenuContent>
                    {Object.values(data.state).map(player_name => (
                        <MenuItemText>{player_name}</MenuItemText>
                    ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
