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
    return (
        <Menu type={MenuType.PoliceJobLicences}>
            <MainMenu>
                <MenuTitle title={data.job} />
                <MenuContent subtitle="L'ordre et la justice !">
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
