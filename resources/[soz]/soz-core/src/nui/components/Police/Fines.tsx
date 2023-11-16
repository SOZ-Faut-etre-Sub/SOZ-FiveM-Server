import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { Fines, PoliceJobFineMenuData } from '@public/shared/job/police';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type FinesStateProps = {
    data: PoliceJobFineMenuData;
};

export const FinesMenu: FunctionComponent<FinesStateProps> = ({ data }) => {
    const banner = `https://nui-img/soz/menu_job_${data.job}`;
    return (
        <Menu type={MenuType.PoliceJobFines}>
            <MainMenu>
                <MenuTitle banner={banner}>L'ordre et la justice !</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.PolicePreCustomFine, {
                                playerServerId: data.playerServerId,
                            });
                        }}
                    >
                        Amende personnalisée
                    </MenuItemButton>
                    {Object.keys(Fines).map(category => {
                        return <MenuItemSubMenuLink id={category}>Catégorie {category}</MenuItemSubMenuLink>;
                    })}
                </MenuContent>
            </MainMenu>
            {Object.keys(Fines).map(category => {
                return (
                    <SubMenu id={category}>
                        <MenuTitle banner={banner}>Catégorie {category}</MenuTitle>
                        <MenuContent>
                            {Fines[category].items.map(fine => {
                                return (
                                    <MenuItemButton
                                        onConfirm={async () => {
                                            await fetchNui(NuiEvent.PolicePreFine, {
                                                playerServerId: data.playerServerId,
                                                fine: fine,
                                            });
                                        }}
                                    >
                                        <div className="flex justify-between">
                                            <div>{fine.label}</div>
                                            <div>
                                                ${fine.price.min} - ${fine.price.max}
                                            </div>
                                        </div>
                                    </MenuItemButton>
                                );
                            })}
                        </MenuContent>
                    </SubMenu>
                );
            })}
        </Menu>
    );
};
