import { FunctionComponent } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export const MenuDemo: FunctionComponent = () => {
    const banner =
        'https://cdn.discordapp.com/attachments/924645707640619089/991854200843669564/SOZ_fond_menus_upw.jpg';

    return (
        <Menu type={MenuType.Demo}>
            <MainMenu>
                <MenuTitle banner={banner}>Main menu</MenuTitle>
                <MenuContent>
                    <MenuItemButton>Button 1</MenuItemButton>
                    <MenuItemButton disabled>Button 2</MenuItemButton>
                    <MenuItemSelect title="Test">
                        <MenuItemSelectOption>Value A</MenuItemSelectOption>
                        <MenuItemSelectOption>Value B</MenuItemSelectOption>
                        <MenuItemSelectOption>Value C</MenuItemSelectOption>
                        <MenuItemSelectOption>Value D</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemText>Text 1</MenuItemText>
                    <MenuItemSubMenuLink id="submenu1">Submenu 1</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="submenu3">Submenu 3</MenuItemSubMenuLink>
                    <MenuItemCheckbox disabled>Checkbox 1</MenuItemCheckbox>
                    <MenuItemCheckbox checked onChange={value => console.log('checkbox 2', value)}>
                        Checkbox 2
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            <SubMenu id="submenu1">
                <MenuTitle>Sub Menu 1</MenuTitle>
                <MenuContent>
                    <MenuItemButton>Sub Menu Button 1</MenuItemButton>
                    <MenuItemButton>Sub Menu Button 2</MenuItemButton>
                    <MenuItemSubMenuLink id="submenu2">Submenu 2</MenuItemSubMenuLink>
                </MenuContent>
            </SubMenu>
            <SubMenu id="submenu2">
                <MenuTitle banner={banner}>Sub Menu 21</MenuTitle>
                <MenuContent>
                    <MenuItemButton>Sub Menu Button 1</MenuItemButton>
                    <MenuItemButton>Sub Menu Button 2</MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id="submenu3">
                <MenuTitle banner={banner}>Sub Menu 3</MenuTitle>
                <MenuContent>
                    <MenuItemButton>Sub Menu Button 1</MenuItemButton>
                    <MenuItemButton>Sub Menu Button 2</MenuItemButton>
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
