import React, { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { InventoryItem } from '../../../shared/item';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuGunSmithStateProps = {
    data: {
        weapons: InventoryItem[];
    };
};

export const MenuGunSmith: FunctionComponent<MenuGunSmithStateProps> = ({ data: { weapons } }) => {
    const banner = 'https://nui-img/soz/menu_job_gunsmith';

    return (
        <Menu type={MenuType.GunSmith}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {weapons.map((weapon, id) => (
                        <MenuItemSubMenuLink id={`gunsmith_${id}`}>
                            {weapon.metadata.label ? weapon.metadata.label + ` (${weapon.label})` : weapon.label}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {weapons.map((weapon, id) => (
                <SubMenu id={`gunsmith_${id}`}>
                    <MenuTitle banner={banner}>Modifier l'arme</MenuTitle>
                    <MenuContent>
                        <MenuItemButton
                            key={id}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.GunSmithRenameWeapon, { slot: weapon.slot });
                            }}
                        >
                            Renommer l'arme
                        </MenuItemButton>
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};
