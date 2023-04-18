import { FunctionComponent } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import { usePlayer } from '../../hook/data';
import {
    MainMenu,
    Menu,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export const MenuPlayerPersonal: FunctionComponent = () => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <Menu type={MenuType.PlayerPersonal}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_personal">
                    {player.charinfo.firstname} {player.charinfo.lastname}
                </MenuTitle>
                <MenuItemSubMenuLink id="identity" description="Voir/Montrer vos papiers d'identité">
                    Mon identité
                </MenuItemSubMenuLink>
                <MenuItemButton>Gestion des clés</MenuItemButton>
                <MenuItemSubMenuLink id="clothing">Gestion de la tenue</MenuItemSubMenuLink>
            </MainMenu>
            <SubMenu id="identity">
                <MenuTitle banner="https://nui-img/soz/menu_personal">
                    {player.charinfo.firstname} {player.charinfo.lastname}
                </MenuTitle>
                <MenuItemSelect title="Carte d'identité">
                    <MenuItemSelectOption>Voir</MenuItemSelectOption>
                    <MenuItemSelectOption>Montrer</MenuItemSelectOption>
                </MenuItemSelect>
                <MenuItemSelect title="Vos licences">
                    <MenuItemSelectOption>Voir</MenuItemSelectOption>
                    <MenuItemSelectOption>Montrer</MenuItemSelectOption>
                </MenuItemSelect>
                <MenuItemSelect title="Carte de santé">
                    <MenuItemSelectOption>Voir</MenuItemSelectOption>
                    <MenuItemSelectOption>Montrer</MenuItemSelectOption>
                </MenuItemSelect>
            </SubMenu>
            <SubMenu id="clothing">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion de la tenue</MenuTitle>
            </SubMenu>
            <SubMenu id="invoices"></SubMenu>
            <SubMenu id="animations"></SubMenu>
            <SubMenu id="hud"></SubMenu>
            <SubMenu id="job"></SubMenu>
            <SubMenu id="voip"></SubMenu>
        </Menu>
    );
};
