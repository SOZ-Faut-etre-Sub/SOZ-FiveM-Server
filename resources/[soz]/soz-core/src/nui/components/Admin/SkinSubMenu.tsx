import { FunctionComponent, useState } from 'react';

import { Component, Outfit, Prop } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
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
        clothConfig: Outfit;
        maxOptions: {
            componentIndex?: Component;
            propIndex?: Prop;
            maxDrawables: number;
        }[];
    };
};

export interface NuiAdminSkinSubMenuMethodMap {
    InitializeSubMenu: {
        clothConfig: Outfit;
        maxOptions: {
            index: Component | Prop;
            maxDrawables: number;
        }[];
    };
    SetComponentDrawable: {
        index: Component | Prop;
        drawable: number;
        isComponent: boolean;
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

const TRANSLATED_INDEXES: Record<string, string> = {
    Head: 'Tête',
    Mask: 'Masque',
    Hair: 'Coupe de cheveux',
    Torso: 'Torse',
    Legs: 'Jambes',
    Bag: 'Sac',
    Shoes: 'Chaussures',
    Accessories: 'Accessoires',
    Undershirt: 'Undershirt',
    BodyArmor: 'Armure',
    Decals: 'Décalques',
    Tops: 'Hauts',
    Hats: 'Chapeaux',
    Glasses: 'Lunettes',
    Ear: 'Accessoires oreilles',
    LeftHand: 'Bras gauche',
    RightHand: 'Bras droit',
};

export const SkinSubMenu: FunctionComponent<SkinSubMenuProps> = ({ banner, updateState, state }) => {
    const [currentDrawable, setCurrentDrawable] = useState<number>(0);

    useNuiEvent(
        'admin_skin_submenu',
        'SetComponentDrawable',
        async (data: { index: number; drawable: number; isComponent: boolean }) => {
            if (data.isComponent) {
                await onComponentChange(data.index, 'drawable', data.drawable);
            } else {
                await onPropChange(data.index, 'drawable', data.drawable);
            }
        }
    );

    useNuiEvent('menu', 'Backspace', () => {
        setCurrentDrawable(0);
    });

    const onComponentChange = async (
        componentIndex: Component | string,
        key: 'drawable' | 'texture',
        value: number
    ) => {
        if (!state.clothConfig) {
            return;
        }

        let componentKey: string | Component = componentIndex;

        if (isNaN(Number(componentIndex))) {
            componentKey = Component[componentIndex];
        }

        const component = state.clothConfig.Components[componentKey.toString()];

        switch (key) {
            case 'drawable':
                component.Drawable = value;
                setCurrentDrawable(value);
                break;
            case 'texture':
                component.Texture = value;
                break;
        }

        updateState('skin', 'clothConfig', state.clothConfig);

        await fetchNui(NuiEvent.AdminMenuSkinChangeComponent, {
            componentIndex,
            component,
        });
    };

    const onPropChange = async (propIndex: Prop | string, key: 'drawable' | 'texture', value: number) => {
        if (!state.clothConfig) {
            return;
        }

        let propKey: string | Prop = propIndex;

        if (isNaN(Number(propKey))) {
            propKey = Prop[propKey];
        }
        const prop = state.clothConfig.Props[propKey.toString()];

        switch (key) {
            case 'drawable':
                prop.Drawable = value;
                setCurrentDrawable(value);
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

    if (!state.clothConfig) {
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
                    <MenuItemSubMenuLink id={'player_style_components'}>
                        👕 Composants du personnage
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={'player_style_props'}>🎩 Accessoires du personnage</MenuItemSubMenuLink>

                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuSkinCopy);
                        }}
                    >
                        📋 Copier la tenue dans le presse papier
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
                    {Object.keys(state.clothConfig.Components).map(componentIndex => (
                        <MenuItemSubMenuLink id={`player_style_component_${componentIndex}`} key={componentIndex}>
                            {`[${componentIndex}] - ${TRANSLATED_INDEXES[Component[componentIndex]]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={'player_style_props'}>
                <MenuTitle banner={banner}>Accessoires du personnage</MenuTitle>
                <MenuContent>
                    {Object.keys(state.clothConfig.Props).map(propIndex => (
                        <MenuItemSubMenuLink id={`player_style_prop_${propIndex}`} key={propIndex}>
                            {`[${propIndex}] - ${TRANSLATED_INDEXES[Prop[propIndex]]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>

            {Object.keys(state.clothConfig.Components).map(componentIndex => (
                <SubMenu id={`player_style_component_${componentIndex}`} key={componentIndex}>
                    <MenuTitle banner={banner}>{`[${componentIndex}] - ${
                        TRANSLATED_INDEXES[Component[componentIndex]]
                    }`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Drawable`}
                            value={currentDrawable || state.clothConfig.Components[componentIndex].Drawable || 0}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuSkinLookAtDrawable, {
                                    index: componentIndex,
                                    isComponent: true,
                                });
                            }}
                            onChange={async index => {
                                await onComponentChange(componentIndex, 'drawable', index);
                            }}
                        >
                            {Array(
                                state.maxOptions.find(option => option.componentIndex === Number(componentIndex))
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
                            value={state.clothConfig.Components[componentIndex].Texture || 0}
                            onChange={async index => {
                                await onComponentChange(componentIndex, 'texture', index);
                            }}
                        >
                            {Array(26)
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

            {Object.keys(state.clothConfig.Props).map(propIndex => (
                <SubMenu id={`player_style_prop_${propIndex}`} key={propIndex}>
                    <MenuTitle banner={banner}>{`[${propIndex}] - ${TRANSLATED_INDEXES[Prop[propIndex]]}`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Drawable`}
                            value={currentDrawable || state.clothConfig.Props[propIndex].Drawable || 0}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.AdminMenuSkinLookAtDrawable, {
                                    index: propIndex,
                                    isComponent: false,
                                });
                            }}
                            onChange={async index => {
                                await onPropChange(propIndex, 'drawable', index);
                            }}
                        >
                            {Array(
                                state.maxOptions.find(option => option.propIndex === Number(propIndex))?.maxDrawables ||
                                    0
                            )
                                .fill(0)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${propIndex}_drawable_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Texture`}
                            value={state.clothConfig.Props[propIndex].Texture || 0}
                            onChange={async index => {
                                await onPropChange(propIndex, 'texture', index);
                            }}
                        >
                            {Array(26)
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
