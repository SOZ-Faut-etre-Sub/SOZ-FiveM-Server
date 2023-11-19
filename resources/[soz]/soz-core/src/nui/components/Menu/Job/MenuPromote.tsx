import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event/nui';
import { PromoteMenuData } from '../../../../shared/nui/job';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../../Styleguide/Menu';

type MenuPromoteProps = {
    data: PromoteMenuData;
};

export const MenuPromote: FunctionComponent<MenuPromoteProps> = ({ data }) => {
    if (!data) {
        return null;
    }
    const banner = `https://nui-img/soz/menu_job_${data.job}`;

    return (
        <Menu type={MenuType.Promote}>
            <MainMenu>
                <MenuTitle banner={banner}>Promouvoir un joueur</MenuTitle>
                <MenuContent>
                    {data.grades.map(grade => (
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.JobPromote, { gradeId: grade.id, target: data.target });
                            }}
                        >
                            {grade.name}
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
