import { FunctionComponent } from 'react';

import { WardrobeMenuData } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type MenuWardrobeProps = {
    wardrobe?: WardrobeMenuData;
};

export const MenuWardrobe: FunctionComponent<MenuWardrobeProps> = ({ wardrobe }) => {
    if (!wardrobe) {
        return null;
    }

    const onConfirm = (name: string | null) => {
        fetchNui(NuiEvent.SetWardrobeOutfit, name ? wardrobe.wardrobe[name] || null : null);
    };

    return (
        <Menu type={MenuType.Wardrobe}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_wardrobe_outdoor">Changer de tenue</MenuTitle>
                <MenuContent>
                    {wardrobe.allowNullLabel && (
                        <MenuItemButton onConfirm={() => onConfirm(null)}>{wardrobe.allowNullLabel}</MenuItemButton>
                    )}
                    {Object.keys(wardrobe.wardrobe).map(name => {
                        return (
                            <MenuItemButton key={name} onConfirm={() => onConfirm(name)}>
                                {name}
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
