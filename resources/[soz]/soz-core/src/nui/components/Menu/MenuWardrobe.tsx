import { usePlayer } from '@public/nui/hook/data';
import { POLICE_CUSTOM_CLOAKROOM } from '@public/shared/job/police';
import { FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { WardRobeElementConfigs, WardRobeElements, WardrobeMenuData } from '../../../shared/cloth';
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
                            <div key={cat}>
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
                            </div>
                        );
                    })}

                    {wardrobe.allowCustom && (
                        <>
                            <MenuSubTitle>------------------------</MenuSubTitle>
                            <MenuItemButton onConfirm={() => selectCustom()}>👮‍♀️ Tenue Personnalisée</MenuItemButton>
                        </>
                    )}
                </MenuContent>
            </MainMenu>
            <SubMenu id="custom" key="custom">
                <MenuTitle title="Vestiaire" />
                <MenuContent>
                    {Object.values(WardRobeElements).map(wardRobeElementId => {
                        const elems =
                            POLICE_CUSTOM_CLOAKROOM[player.job.id] &&
                            POLICE_CUSTOM_CLOAKROOM[player.job.id][player.skin.Model.Hash][wardRobeElementId];

                        if (!elems || !Object.values(elems).length) {
                            return;
                        }

                        return (
                            <MenuItemSelect
                                key={wardRobeElementId}
                                title={WardRobeElementConfigs[wardRobeElementId].label}
                                onChange={async (index, item) => {
                                    await fetchNui(NuiEvent.WardrobeElementSelect, { outfit: item, wardRobeElementId });
                                }}
                            >
                                {Object.entries(elems).map(([name, item]) => {
                                    return (
                                        <MenuItemSelectOption value={item} key={name} helper={name}>
                                            <div className="flex justify-between items-center">
                                                <span>{name}</span>
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
