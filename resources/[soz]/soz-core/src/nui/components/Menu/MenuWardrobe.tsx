import { FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { WardRobeElements, WardrobeMenuData } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuWardrobeProps = {
    wardrobe?: WardrobeMenuData;
};

const icon = {
    ['Equipement seulement']: '🕵️‍♂️',
};

export const MenuWardrobe: FunctionComponent<MenuWardrobeProps> = ({ wardrobe }) => {
    const navigate = useNavigate();
    const location = useLocation();
    if (!wardrobe) {
        return null;
    }

    const selectCustom = () => {
        navigate(`/${MenuType.Wardrobe}/custom`, {
            state: location.state,
        });
    };

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
                                {icon[name] ? icon[name] + ' ' + name : name}
                            </MenuItemButton>
                        );
                    })}
                    {wardrobe.allowCustom && (
                        <MenuItemButton onConfirm={() => selectCustom()}>👮‍♀️ {wardrobe.allowCustom}</MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
            <SubMenu id="custom" key="custom">
                <MenuTitle banner="https://nui-img/soz/menu_wardrobe_outdoor">Changer de tenue</MenuTitle>
                <MenuContent>
                    {Object.keys(WardRobeElements).map(wardRobeElementId => {
                        const elems = Object.keys(wardrobe.wardrobe)
                            .sort()
                            .filter(item => {
                                if (WardRobeElements[wardRobeElementId].componentId) {
                                    return WardRobeElements[wardRobeElementId].componentId.some(
                                        id => wardrobe.wardrobe[item].Components[id]
                                    );
                                } else if (WardRobeElements[wardRobeElementId].propId) {
                                    return WardRobeElements[wardRobeElementId].propId.some(
                                        id => wardrobe.wardrobe[item].Props[id]
                                    );
                                }
                                return false;
                            });

                        if (!elems.length) {
                            return;
                        }

                        return (
                            <MenuItemSelect
                                title={WardRobeElements[wardRobeElementId].label}
                                onChange={async (index, item) => {
                                    await fetchNui(NuiEvent.WardrobeElementSelect, {
                                        outfit: wardrobe.wardrobe[item],
                                        wardRobeElementId: wardRobeElementId,
                                    });
                                }}
                            >
                                {elems.map(item => {
                                    return (
                                        <MenuItemSelectOption value={item}>
                                            <div className="flex justify-between items-center">
                                                <span>{item}</span>
                                            </div>
                                        </MenuItemSelectOption>
                                    );
                                })}
                            </MenuItemSelect>
                        );
                    })}
                    <MenuItemButton key="submit" onConfirm={async () => await fetchNui(NuiEvent.WardrobeCustomSave)}>
                        Valider
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
