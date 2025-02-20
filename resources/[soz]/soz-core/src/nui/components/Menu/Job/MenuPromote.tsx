import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../../shared/event/nui';
import { JobLabel } from '../../../../shared/job';
import { PromoteMenuData } from '../../../../shared/nui/job';
import { MenuType } from '../../../../shared/nui/menu';
import { fetchNui } from '../../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../../Styleguide/Menu';

type MenuPromoteProps = {
    data: PromoteMenuData;
};
const banners_in_core = ['dmc', 'you-news'];

export const MenuPromote: FunctionComponent<MenuPromoteProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.Promote}>
            <MainMenu>
                <MenuTitle title={JobLabel[data.job]} />
                <MenuContent subtitle="Promouvoir un joueur">
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
