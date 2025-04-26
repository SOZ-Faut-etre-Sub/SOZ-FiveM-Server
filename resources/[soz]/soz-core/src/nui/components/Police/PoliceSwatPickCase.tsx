import { SwatClassesDescription, SwatClassesType } from '@private/shared/police';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

export const PoliceSwatPickCaseMenu: FunctionComponent = () => {
    return (
        <Menu type={MenuType.HousingChangePrincipalApartementMenu}>
            <MainMenu>
                <MenuTitle title="Malette SWAT" />
                <MenuContent>
                    {Object.entries(SwatClassesType).map(([swatClass, label]) => {
                        return (
                            <MenuItemButton
                                onConfirm={() => {
                                    fetchNui(NuiEvent.PoliceSelectSwatCase, swatClass);
                                }}
                                description={SwatClassesDescription[swatClass]}
                                key={swatClass}
                            >
                                {label}
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
