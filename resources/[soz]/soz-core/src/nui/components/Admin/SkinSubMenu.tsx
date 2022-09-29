import { FunctionComponent, useEffect, useState } from 'react';

import { ClothConfig, ComponentIndex, PropIndex } from '../../../shared/clothing';
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
};

export interface NuiAdminSkinSubMenuMethodMap {
    SetMaxOptions: {
        drawables: number;
        textures: number;
        palettes: number;
    };
}

const mockSkin: ClothConfig = {
    components: {
        [ComponentIndex.Head]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Mask]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Hair]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Torso]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Legs]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Bags]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Shoes]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Accessories]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Undershirt]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.BodyArmor]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Decals]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
        [ComponentIndex.Tops]: {
            drawableId: 0,
            textureId: 0,
            paletteId: 0,
        },
    },
    props: {
        [PropIndex.Hats]: {
            drawableId: 0,
            textureId: 0,
        },
        [PropIndex.Glasses]: {
            drawableId: 0,
            textureId: 0,
        },
        [PropIndex.EarPieces]: {
            drawableId: 0,
            textureId: 0,
        },
        [PropIndex.Watches]: {
            drawableId: 0,
            textureId: 0,
        },
        [PropIndex.Bracelets]: {
            drawableId: 0,
            textureId: 0,
        },
    },
};

const SKIN_OPTIONS = [
    { key: 'skin_dog', label: 'Chien', value: 'a_c_shepherd' },
    { key: 'skin_cat', label: 'Chat', value: 'a_c_cat_01' },
    { key: 'civilian_female', label: 'Civil Femme', value: 'u_f_y_mistress' },
    { key: 'civilian_male', label: 'Civil Homme', value: 'a_m_y_latino_01' },
    { key: 'player_female', label: 'Joueur Femme', value: 'mp_f_freemode_01' },
    { key: 'player_male', label: 'Joueur Homme', value: 'mp_m_freemode_01' },
];

export const SkinSubMenu: FunctionComponent<SkinSubMenuProps> = ({ banner }) => {
    const [clothConfig, setClothConfig] = useState<ClothConfig>(null);
    const [maxDrawable, setMaxDrawable] = useState<number>(0);
    const [maxTexture, setMaxTexture] = useState<number>(0);
    const [maxPalette, setMaxPalette] = useState<number>(0);
    const [currentTextureId, setCurrentTextureId] = useState<number>(0);

    useNuiEvent('admin_skin_submenu', 'SetMaxOptions', (data: NuiAdminSkinSubMenuMethodMap['SetMaxOptions']) => {
        setMaxDrawable(data.drawables);
        setMaxTexture(data.textures);
        setMaxPalette(data.palettes);
    });

    const onComponentChange = async (
        componentIndex: ComponentIndex,
        key: 'drawable' | 'texture' | 'palette',
        value: number
    ) => {
        const component = clothConfig.components[ComponentIndex[componentIndex]];

        switch (key) {
            case 'drawable':
                component.drawableId = value;
                component.textureId = 0;
                setCurrentTextureId(0);
                break;
            case 'texture':
                component.textureId = value;
                break;
            case 'palette':
                component.paletteId = value;
                break;
        }

        await fetchNui(NuiEvent.AdminMenuSkinChangeComponent, {
            componentIndex,
            component,
        });
    };

    useEffect(() => {
        if (!clothConfig) {
            setClothConfig(mockSkin);
        }
    });

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
                    {Object.keys(clothConfig.components).map(componentIndex => (
                        <MenuItemSubMenuLink id={`player_style_${componentIndex}`} key={componentIndex}>
                            {`[${componentIndex}] - ${ComponentIndex[componentIndex]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={'player_style_props'}>
                <MenuTitle banner={banner}>Accessoires du personnage</MenuTitle>
                <MenuContent>
                    {Object.keys(clothConfig.props).map(propIndex => (
                        <MenuItemSubMenuLink id={`player_style_${propIndex}`} key={propIndex}>
                            {`[${propIndex}] - ${PropIndex[propIndex]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>

            {Object.keys(clothConfig.components).map(componentIndex => (
                <SubMenu id={`player_style_${componentIndex}`} key={componentIndex}>
                    <MenuTitle banner={banner}>{`[${componentIndex}] - ${ComponentIndex[componentIndex]}`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Drawable`}
                            onChange={async index => {
                                await onComponentChange(ComponentIndex[componentIndex], 'drawable', index);
                            }}
                        >
                            {Array(maxDrawable)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${componentIndex}_drawable_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Texture`}
                            value={currentTextureId}
                            disabled={maxTexture < 1}
                            onChange={async index => {
                                await onComponentChange(ComponentIndex[componentIndex], 'texture', index);
                            }}
                        >
                            {Array(maxTexture)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${componentIndex}_texture_${index}`}>
                                        {index}
                                    </MenuItemSelectOption>
                                ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Palette`}
                            disabled={maxPalette < 1}
                            onChange={async index => {
                                await onComponentChange(ComponentIndex[componentIndex], 'palette', index);
                            }}
                        >
                            {Array(maxPalette)
                                .fill(0)
                                .map((_, index) => (
                                    <MenuItemSelectOption key={`${componentIndex}_palette_${index}`}>
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
