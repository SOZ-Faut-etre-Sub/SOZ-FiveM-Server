import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlacementProp, PropPlacementMenuData } from '@public/shared/nui/prop_placement';
import { FunctionComponent } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuPropPlacementProps = {
    data: PropPlacementMenuData;
};

export const MenuPropPlacement: FunctionComponent<MenuPropPlacementProps> = ({ data }) => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    const onSelectProp = (selectedProp: PlacementProp) => {
        return async () => {
            await fetchNui(NuiEvent.SelectPlacementProp, { selectedProp });
        };
    };
    if (!data.propState) {
        return (
            <Menu type={MenuType.PropPlacementMenu}>
                <MainMenu>
                    <MenuTitle banner="https://nui-img/soz/menu_mapper">Placement de Props</MenuTitle>
                    <MenuContent>
                        <MenuItemSubMenuLink id="prop_list" description="Voir mes props posés">
                            Ma liste de props
                        </MenuItemSubMenuLink>
                        <MenuItemSubMenuLink id="prop_choose" description="Placer un prop">
                            Placer un prop
                        </MenuItemSubMenuLink>
                    </MenuContent>
                </MainMenu>
                <SubMenu id="prop_choose">
                    <MenuTitle banner="https://nui-img/soz/menu_mapper">Choisir un prop</MenuTitle>
                    <MenuContent>
                        <MenuItemButton onConfirm={onSelectProp(null)}>🔎 Entrer un modèle</MenuItemButton>
                        <MenuTitle>Liste de props</MenuTitle>
                        {data.props.map(prop => (
                            <MenuItemButton key={prop.model} onConfirm={onSelectProp(prop)}>
                                {prop.label}
                            </MenuItemButton>
                        ))}
                    </MenuContent>
                </SubMenu>
            </Menu>
        );
    } else {
        return (
            <Menu type={MenuType.PropPlacementMenu}>
                <MainMenu>
                    <MenuTitle banner="https://nui-img/soz/menu_mapper">
                        Placement : {data.propState ? data.propState.label : ''}
                    </MenuTitle>
                    <MenuContent>
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.LeavePlacementMode);
                            }}
                        >
                            ❌ Quitter le mode placement
                        </MenuItemButton>
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.PropPlacementReset, { snap: true });
                            }}
                        >
                            ⬇️ Snap au sol
                        </MenuItemButton>
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.PropPlacementReset, { position: true });
                            }}
                        >
                            🔄 Réinitialiser la position
                        </MenuItemButton>
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.PropPlacementReset, { rotation: true });
                            }}
                        >
                            🔄 Réinitialiser la rotation
                        </MenuItemButton>
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.PropPlacementReset, { position: true, rotation: true, scale: true });
                            }}
                        >
                            🔄 Réinitialiser tout
                        </MenuItemButton>
                        <MenuItemText> Mode Translation : T</MenuItemText>
                        <MenuItemText> Mode Rotation : R</MenuItemText>
                        <MenuItemText> Mode Scale : S</MenuItemText>
                        <MenuItemText> Coordonnées locales : L</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }
};
