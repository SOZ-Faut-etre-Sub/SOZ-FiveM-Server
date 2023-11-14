import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { PoliceJobMoneycheckerMenuData } from '@public/shared/job/police';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type MoneycheckerStateProps = {
    data: PoliceJobMoneycheckerMenuData;
};

export const MoneyChecker: FunctionComponent<MoneycheckerStateProps> = ({ data }) => {
    const banner = `https://nui-img/soz/menu_job_${data.job}`;

    return (
        <Menu type={MenuType.PoliceJobLicences}>
            <MainMenu>
                <MenuTitle banner={banner}>L'ordre et la justice !</MenuTitle>
                <MenuContent>
                    <MenuItemText>
                        <div className="flex justify-between">
                            <div>Argent marqué</div>
                            <div>${data.amount}</div>
                        </div>
                    </MenuItemText>
                    {data.amount > 0 && (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.PoliceGatherMoneyMarked, data.playerServerId);
                            }}
                        >
                            Confisquer l'argent marqué
                        </MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
