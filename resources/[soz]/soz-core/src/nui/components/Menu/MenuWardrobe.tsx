import { usePlayer } from '@public/nui/hook/data';
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
    MenuSubTitle,
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
    const player = usePlayer();
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

    const categories = Array.from(new Set(Object.values(wardrobe.wardrobe).map(elem => elem.category)));

    return (
        <Menu type={MenuType.Wardrobe}>
            <MainMenu>
                <MenuTitle title="Vestiaire" />
                <MenuContent>
                    {wardrobe.allowNullLabel && player.cloth_config.JobClothSet && (
                        <MenuItemButton onConfirm={() => onConfirm(null)}>{wardrobe.allowNullLabel}</MenuItemButton>
                    )}
                    {wardrobe.allowCustom && !player.cloth_config.JobClothSet && (
                        <MenuItemButton onConfirm={() => fetchNui(NuiEvent.PersonnalCloakroom)}>
                            Tenues Personnelles
                        </MenuItemButton>
                    )}

                    {categories.map(cat => {
                        return (
                            <>
                                {categories.length > 0 && <MenuSubTitle>{cat}</MenuSubTitle>}
                                {Object.keys(wardrobe.wardrobe)
                                    .filter(name => wardrobe.wardrobe[name].category === cat)
                                    .map(name => {
                                        return (
                                            <MenuItemButton key={name} onConfirm={() => onConfirm(name)}>
                                                {icon[name] ? icon[name] + ' ' + name : name}
                                            </MenuItemButton>
                                        );
                                    })}
                            </>
                        );
                    })}

                    {wardrobe.allowCustom && (
                        <>
                            <MenuSubTitle>------------------------</MenuSubTitle>
                            <MenuItemButton onConfirm={() => selectCustom()}>👮‍♀️ {wardrobe.allowCustom}</MenuItemButton>
                        </>
                    )}
                </MenuContent>
            </MainMenu>
            <SubMenu id="custom" key="custom">
                <MenuTitle title="Vestiaire" />
                <MenuContent>
                    {Object.keys(WardRobeElements).map(wardRobeElementId => {
                        const elems = Object.keys(wardrobe.wardrobe)
                            .sort()
                            .filter(item => {
                                if (!wardrobe.wardrobe[item].type) {
                                    if (WardRobeElements[wardRobeElementId].componentId) {
                                        return WardRobeElements[wardRobeElementId].componentId.some(
                                            id => wardrobe.wardrobe[item].Components[id]
                                        );
                                    } else if (WardRobeElements[wardRobeElementId].propId) {
                                        return WardRobeElements[wardRobeElementId].propId.some(
                                            id => wardrobe.wardrobe[item].Props[id]
                                        );
                                    }
                                }
                                return false;
                            });

                        if (!elems.length) {
                            return;
                        }

                        return (
                            <MenuItemSelect
                                key={wardRobeElementId}
                                title={WardRobeElements[wardRobeElementId].label}
                                onChange={async (index, item) => {
                                    await fetchNui(NuiEvent.WardrobeElementSelect, {
                                        outfit: wardrobe.wardrobe[item],
                                        wardRobeElementId: wardRobeElementId,
                                        clear: item == 'clear',
                                    });
                                }}
                            >
                                {WardRobeElements[wardRobeElementId].addClear && (
                                    <MenuItemSelectOption value="clear" key="clear" helper="Aucun">
                                        <div className="flex justify-between items-center">
                                            <span>Aucun</span>
                                        </div>
                                    </MenuItemSelectOption>
                                )}
                                {elems.map(item => {
                                    return (
                                        <MenuItemSelectOption value={item} key={item} helper={item}>
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
