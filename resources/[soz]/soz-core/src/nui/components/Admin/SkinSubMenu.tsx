import { FunctionComponent, useEffect, useState } from 'react';

import { ClothSet, ComponentIndex, PropIndex } from '../../../shared/clothing';
import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type SkinSubMenuProps = {
    banner: string;
    updateState: (namespace: 'skin', key: keyof SkinSubMenuProps['state'], value: any) => void;
    state: {
        clothConfig: ClothSet;
        maxOptions: {
            componentIndex?: ComponentIndex;
            propIndex?: PropIndex;
            maxDrawables: number;
        }[];
    };
};

export interface NuiAdminSkinSubMenuMethodMap {
    InitializeSubMenu: {
        clothConfig: ClothSet;
        maxOptions: {
            index: ComponentIndex | PropIndex;
            maxDrawables: number;
        }[];
    };
}

const SKIN_OPTIONS = [
    { key: 'skin_dog', label: 'Chien', value: 'a_c_shepherd' },
    { key: 'skin_cat', label: 'Chat', value: 'a_c_cat_01' },
    { key: 'civilian_female', label: 'Civil Femme', value: 'u_f_y_mistress' },
    { key: 'civilian_male', label: 'Civil Homme', value: 'a_m_y_latino_01' },
    { key: 'player_female', label: 'Joueur Femme', value: 'mp_f_freemode_01' },
    { key: 'player_male', label: 'Joueur Homme', value: 'mp_m_freemode_01' },
];

export const SkinSubMenu: FunctionComponent<SkinSubMenuProps> = ({ banner, updateState, state }) => {
    const [clothConfig, setClothConfig] = useState<ClothSet>(null);
    const [maxOptions, setMaxOptions] = useState<SkinSubMenuProps['state']['maxOptions']>([]);

    useEffect(() => {
        if (state && state.clothConfig && state.clothConfig !== clothConfig) {
            setClothConfig(state.clothConfig);
        }
        if (state && state.maxOptions && state.maxOptions !== maxOptions) {
            setMaxOptions(state.maxOptions);
        }
    }, [state]);

    const onComponentChange = async (componentIndex: ComponentIndex, key: 'drawable' | 'texture', value: number) => {
        if (!clothConfig) {
            return;
        }

        const component = clothConfig.Components[ComponentIndex[componentIndex]];

        switch (key) {
            case 'drawable':
                component.Drawable = value;
                break;
            case 'texture':
                component.Texture = value;
                break;
        }

        updateState('skin', 'clothConfig', clothConfig);

        await fetchNui(NuiEvent.AdminMenuSkinChangeComponent, {
            componentIndex,
            component,
        });
    };

    const onPropChange = async (propIndex: PropIndex, key: 'drawable' | 'texture', value: number) => {
        if (!clothConfig) {
            return;
        }
        const prop = clothConfig.Props[PropIndex[propIndex]];

        switch (key) {
            case 'drawable':
                prop.Drawable = value;
                break;
            case 'texture':
                prop.Texture = value;
                break;
        }

        await fetchNui(NuiEvent.AdminMenuSkinChangeProp, {
            propIndex,
            prop,
        });
    };

    if (!clothConfig) {
        return null;
    }

    return (
        <>
            <SubMenu id="skin">
                <MenuTitle banner={banner}>Chien, Chat, Président...</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuSkinChangeAppearance);
                        }}
                    >
                        Changer l'apparence du personnage
                    </MenuItemButton>
                    <MenuItemSelect
                        title={`Liste d'apparence prédéfini`}
                        onConfirm={async selectedIndex => {
                            const value = SKIN_OPTIONS[selectedIndex].value;
                            await fetchNui(NuiEvent.AdminMenuSkinChangeAppearance, value);
                        }}
                    >
                        {SKIN_OPTIONS.map(option => (
                            <MenuItemSelectOption key={option.key}>{option.label}</MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuItemSubMenuLink id={'player_style'}>Modifier les éléments du personnage</MenuItemSubMenuLink>
                </MenuContent>
            </SubMenu>
            <SubMenu id={'player_style'}>
                <MenuTitle banner={banner}>Modifier les éléments du personnage</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id={'player_style_components'}>Composants du personnage</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={'player_style_props'}>Accessoires du personnage</MenuItemSubMenuLink>

                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuSkinCopy);
                        }}
                    >
                        Copier la tenue dans le presse papier
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuSkinSave);
                        }}
                    >
                        Sauvegarder cette tenue
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id={'player_style_components'}>
                <MenuTitle banner={banner}>Éléments du personnage</MenuTitle>
                <MenuContent>
                    {Object.keys(clothConfig.Components).map(componentIndex => (
                        <MenuItemSubMenuLink id={`player_style_component_${componentIndex}`} key={componentIndex}>
                            {`[${componentIndex}] - ${ComponentIndex[componentIndex]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={'player_style_props'}>
                <MenuTitle banner={banner}>Accessoires du personnage</MenuTitle>
                <MenuContent>
                    {Object.keys(clothConfig.Props).map(propIndex => (
                        <MenuItemSubMenuLink id={`player_style_prop_${propIndex}`} key={propIndex}>
                            {`[${propIndex}] - ${PropIndex[propIndex]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>

            {Object.keys(clothConfig.Components).map(componentIndex => (
                <SubMenu id={`player_style_component_${componentIndex}`} key={componentIndex}>
                    <MenuTitle banner={banner}>{`[${componentIndex}] - ${ComponentIndex[componentIndex]}`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Drawable`}
                            value={clothConfig.Components[componentIndex].Drawable || 0}
                            onChange={async index => {
                                await onComponentChange(ComponentIndex[componentIndex], 'drawable', index);
                            }}
                        >
                            {Array(
                                maxOptions.find(option => option.componentIndex === Number(componentIndex))
                                    ?.maxDrawables || 0
                            )
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${componentIndex}_drawable_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Texture`}
                            value={clothConfig.Components[componentIndex].Texture || 0}
                            onChange={async index => {
                                await onComponentChange(ComponentIndex[componentIndex], 'texture', index);
                            }}
                        >
                            {Array(20)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${componentIndex}_texture_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                    </MenuContent>
                </SubMenu>
            ))}

            {Object.keys(clothConfig.Props).map(propIndex => (
                <SubMenu id={`player_style_prop_${propIndex}`} key={propIndex}>
                    <MenuTitle banner={banner}>{`[${propIndex}] - ${PropIndex[propIndex]}`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Drawable`}
                            value={clothConfig.Props[propIndex].Drawable || 0}
                            onChange={async index => {
                                await onPropChange(PropIndex[propIndex], 'drawable', index);
                            }}
                        >
                            {Array(maxOptions.find(option => option.propIndex === Number(propIndex))?.maxDrawables || 0)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${propIndex}_drawable_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Texture`}
                            value={clothConfig.Props[propIndex].Texture || 0}
                            onChange={async index => {
                                await onPropChange(PropIndex[propIndex], 'texture', index);
                            }}
                        >
                            {Array(20)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${propIndex}_texture_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                    </MenuContent>
                </SubMenu>
            ))}
        </>
    );
};
