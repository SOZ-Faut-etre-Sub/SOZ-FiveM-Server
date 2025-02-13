import { FunctionComponent } from 'react';

import { JobLabel } from '../../../shared/job';
import { NuiJobEmployeeOnDuty } from '../../../shared/nui/job';
import { MenuType } from '../../../shared/nui/menu';
import { MainMenu, Menu, MenuContent, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type MenuJobOnDutyProps = {
    data: NuiJobEmployeeOnDuty;
};

export const JobOnDutyMenu: FunctionComponent<MenuJobOnDutyProps> = ({ data }) => {
    if (!data.state.length) {
        return null;
    }

    return (
        <Menu type={MenuType.JobOnDutyMenu}>
            <MainMenu>
                <MenuTitle title={JobLabel[data.job]} />
                <MenuContent subtitle="Employé(e)s en service">
                    {Object.values(data.state).map(player_name => (
                        <MenuItemText>{player_name}</MenuItemText>
                    ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
