import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FfsComponent, Outfit, Prop, ShowRoomPricePerSelection } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { ShowRoomFreeElement } from '../../../shared/FightForStyleShowRoom/ffsClothConfig';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

const TRANSLATED_INDEXES: Record<string, string> = {
    Mask: 'Masque',
    Torso: 'Taille et gants',
    Legs: 'Pantalons',
    Bag: 'Sac',
    Shoes: 'Chaussures',
    Accessories: 'Accessoires',
    Undershirt: 'Undershirt',
    Tops: 'Hauts',
    Hat: 'Chapeau',
    Glasses: 'Lunettes',
    Ear: 'Accessoires oreilles',
    LeftHand: 'Bras gauche',
    RightHand: 'Bras droit',
};

type FightForStyleShowRoomComponent = {
    data: {
        state: {
            clothConfig: Outfit;
            options: {
                Components: Record<FfsComponent, Record<number, Array<number>>>;
                Props: Record<Prop, Array<number>>;
            };
        };
        canCraft: boolean;
        pedModel: string;
        defaultComponentAndProd: Partial<Outfit>;
        outfitType: string;
    };
};

export interface NuiFFSSubMenuMethodMap {
    InitializeSubMenu: {
        clothConfig: Outfit;
        options: {
            Components: Record<FfsComponent, Record<number, Array<number>>>;
            Props: Record<Prop, Array<number>>;
        };
    };
    SetComponentDrawable: {
        index: FfsComponent | Prop;
        drawable: number;
        isComponent: boolean;
    };
    SetClotheDescription: {
        description: string;
    };
}

export const FightForStyleShowRoomMenu: FunctionComponent<FightForStyleShowRoomComponent> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_ffs';
    const [currentDrawable, setCurrentDrawable] = useState<number>(0);
    const [currentCraft, setCurrentCraft] = useState<Partial<Outfit>>(data.defaultComponentAndProd);
    const [shouldCraft, setShouldCraft] = useState<{
        Components: Partial<Record<FfsComponent, boolean>>;
        Props: Partial<Record<Prop, boolean>>;
    }>({ Components: {}, Props: {} });
    const [description, setDescription] = useState<string>();
    const [price, setPrice] = useState<number>(0);
    const navigate = useNavigate();
    const state = data.state;
    const canCraft = data.canCraft;
    const pedModel = data.pedModel;

    useEffect(() => {
        let clothesPrice = 0;
        Object.keys(currentCraft.Components).map(componentIndex => {
            if (
                !ShowRoomFreeElement[pedModel].Components[componentIndex]?.includes(
                    currentCraft.Components[componentIndex].Drawable
                )
            ) {
                if (shouldCraft.Components?.[componentIndex]) {
                    clothesPrice += ShowRoomPricePerSelection;
                }
            }
        });
        Object.keys(currentCraft.Props).map(propIndex => {
            if (!ShowRoomFreeElement[pedModel].Props[propIndex]?.includes(currentCraft.Props[propIndex].Drawable)) {
                if (shouldCraft.Props?.[propIndex]) {
                    clothesPrice += ShowRoomPricePerSelection;
                }
            }
        });
        setPrice(clothesPrice);
    }, [shouldCraft, currentCraft]);

    useNuiEvent(
        'ffs_skin_submenu',
        'SetComponentDrawable',
        async (data: { index: number; drawable: number; isComponent: boolean }) => {
            if (data.isComponent) {
                await onComponentChange(data.index, 'drawable', data.drawable);
            } else {
                await onPropChange(data.index, 'drawable', data.drawable);
            }
            navigate(-1);
        }
    );

    useNuiEvent('ffs_skin_submenu', 'SetClotheDescription', async (data: { description: string }) => {
        setDescription(data.description);
    });

    useNuiEvent('menu', 'Backspace', () => {
        setCurrentDrawable(0);
    });

    const onCraftSelection = (index: string, key: 'Components' | 'Props', value: boolean) => {
        const newCraft = structuredClone(shouldCraft);
        newCraft[key][index] = value;
        setShouldCraft(newCraft);
    };

    const onComponentChange = async (
        componentIndex: FfsComponent | string,
        key: 'drawable' | 'texture',
        value: number
    ) => {
        if (!state.clothConfig) {
            return;
        }

        let componentKey: string | FfsComponent = componentIndex;

        if (isNaN(Number(componentIndex))) {
            componentKey = FfsComponent[componentIndex];
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

        const newCraft = structuredClone(currentCraft);
        newCraft.Components[componentIndex] = component;
        setCurrentCraft(newCraft);

        return await fetchNui(NuiEvent.FfsShowRoomChangeComponent, {
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

        const newCraft = structuredClone(currentCraft);
        newCraft.Props[propIndex] = prop;
        setCurrentCraft(newCraft);

        return await fetchNui(NuiEvent.FfsShowRoomChangeProp, {
            propIndex,
            prop,
        });
    };

    if (!state.clothConfig) {
        return null;
    }

    return (
        <Menu type={MenuType.FightForStyleShowRoomMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id={'player_style_components'}>
                        👕 Vêtements, chaussures, masques et accessoires
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={'player_style_props'}>🎩 Autres accessoires</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={'crafting_menu'}>Selection et Confection des tenues</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <SubMenu id={'player_style_components'}>
                <MenuTitle banner={banner}>Vêtements, chaussures, masques et accessoires</MenuTitle>
                <MenuContent>
                    {Object.keys(state.clothConfig.Components).map(componentIndex => (
                        <MenuItemSubMenuLink id={`player_style_component_${componentIndex}`} key={componentIndex}>
                            {`${TRANSLATED_INDEXES[FfsComponent[componentIndex]]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={'player_style_props'}>
                <MenuTitle banner={banner}>Autres accessoires</MenuTitle>
                <MenuContent>
                    {Object.keys(state.clothConfig.Props).map(propIndex => (
                        <MenuItemSubMenuLink id={`player_style_prop_${propIndex}`} key={propIndex}>
                            {`${TRANSLATED_INDEXES[Prop[propIndex]]}`}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id="crafting_menu">
                <MenuTitle banner={banner}>Selection et Confection des tenues</MenuTitle>
                <MenuContent>
                    {Object.keys(currentCraft?.Components || {}).map(componentIndex => (
                        <MenuItemCheckbox
                            checked={shouldCraft?.Components?.[componentIndex] || false}
                            onChange={value => {
                                onCraftSelection(componentIndex, 'Components', value);
                            }}
                        >
                            {`${TRANSLATED_INDEXES[FfsComponent[componentIndex]]}: ${
                                currentCraft.Components[componentIndex].Drawable
                            } - ${currentCraft.Components[componentIndex].Texture}`}
                        </MenuItemCheckbox>
                    ))}
                    {Object.keys(currentCraft?.Props || {}).map(propIndex => (
                        <MenuItemCheckbox
                            checked={shouldCraft?.Props?.[propIndex] || false}
                            onChange={value => {
                                onCraftSelection(propIndex, 'Props', value);
                            }}
                        >
                            {`${TRANSLATED_INDEXES[Prop[propIndex]]}: ${currentCraft.Props[propIndex].Drawable} - ${
                                currentCraft.Props[propIndex].Texture
                            }`}
                        </MenuItemCheckbox>
                    ))}
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.FfsMenuChangeDescription);
                        }}
                    >{`Description: ${description || 'Null'}`}</MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.FfsMenuCraftOutfit, {
                                currentCraft: currentCraft,
                                shouldCraft: shouldCraft,
                                description: description,
                                outfitType: data.outfitType,
                                pedModel: pedModel,
                            });
                        }}
                        disabled={!canCraft}
                    >
                        {`Confectionner la tenue - ${price}$`}
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>

            {Object.keys(state.clothConfig.Components).map(componentIndex => (
                <SubMenu id={`player_style_component_${componentIndex}`} key={componentIndex}>
                    <MenuTitle banner={banner}>{`[${componentIndex}] - ${
                        TRANSLATED_INDEXES[FfsComponent[componentIndex]]
                    }`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Vêtement`}
                            value={currentDrawable || state.clothConfig.Components[componentIndex].Drawable || 0}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.FfsMenuLookAtDrawable, {
                                    index: componentIndex,
                                    isComponent: true,
                                    pedModel: pedModel,
                                });
                            }}
                            onChange={async (_, value) => {
                                await onComponentChange(componentIndex, 'drawable', value);
                            }}
                        >
                            {Object.keys(state.options.Components[componentIndex]).map(value => (
                                <MenuItemSelectOption
                                    value={parseInt(value)}
                                    key={`${componentIndex}_drawable_${value}`}
                                >
                                    {value}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Style`}
                            value={state.clothConfig.Components[componentIndex].Texture || 0}
                            onChange={async (_, value) => {
                                await onComponentChange(componentIndex, 'texture', value);
                            }}
                        >
                            {(
                                state.options.Components[componentIndex][
                                    currentDrawable || state.clothConfig.Components[componentIndex].Texture || 0
                                ] || []
                            ).map(value => (
                                <MenuItemSelectOption value={value} key={`${componentIndex}_texture_${value}`}>
                                    {value}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSubMenuLink
                            id={`player_free_component_${componentIndex}`}
                            key={componentIndex}
                            disabled={!Object.keys(ShowRoomFreeElement[pedModel].Components[componentIndex]).length}
                        >
                            {`${TRANSLATED_INDEXES[FfsComponent[componentIndex]]} Gratuit`}
                        </MenuItemSubMenuLink>
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
                                await fetchNui(NuiEvent.FfsMenuLookAtDrawable, {
                                    index: propIndex,
                                    isComponent: false,
                                    pedModel: pedModel,
                                });
                            }}
                            onChange={async (_, value) => {
                                await onPropChange(propIndex, 'drawable', value);
                            }}
                        >
                            {Object.keys(state.options.Props[propIndex]).map(value => (
                                <MenuItemSelectOption value={parseInt(value)} key={`${propIndex}_drawable_${value}`}>
                                    {value}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Texture`}
                            value={state.clothConfig.Props[propIndex].Texture || 0}
                            onChange={async (_, value) => {
                                await onPropChange(propIndex, 'texture', value);
                            }}
                        ></MenuItemSelect>
                        {(
                            state.options.Props[propIndex][
                                currentDrawable || state.clothConfig.Props[propIndex].Texture || 0
                            ] || []
                        ).map(value => (
                            <MenuItemSelectOption value={value} key={`${propIndex}_texture_${value}`}>
                                {value}
                            </MenuItemSelectOption>
                        ))}
                        <MenuItemSubMenuLink
                            id={`player_free_prop_${propIndex}`}
                            key={propIndex}
                            disabled={!Object.keys(ShowRoomFreeElement[pedModel].Props[propIndex]).length}
                        >
                            {`${TRANSLATED_INDEXES[Prop[propIndex]]} Gratuit`}
                        </MenuItemSubMenuLink>
                    </MenuContent>
                </SubMenu>
            ))}

            {Object.keys(state.clothConfig.Components).map(componentIndex => (
                <SubMenu id={`player_free_component_${componentIndex}`} key={componentIndex}>
                    <MenuTitle banner={banner}>{`[${componentIndex}] - ${
                        TRANSLATED_INDEXES[FfsComponent[componentIndex]]
                    } Gratuit`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect
                            title={`Vêtement`}
                            value={currentDrawable || state.clothConfig.Components[componentIndex].Drawable || 0}
                            onChange={async (_, value) => {
                                await onComponentChange(componentIndex, 'drawable', value);
                            }}
                        >
                            {ShowRoomFreeElement[pedModel].Components[componentIndex].map(value => (
                                <MenuItemSelectOption value={value} key={`${componentIndex}_drawable_${value}`}>
                                    {value}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Style`}
                            value={state.clothConfig.Components[componentIndex].Texture || 0}
                            onChange={async (_, value) => {
                                await onComponentChange(componentIndex, 'texture', value);
                            }}
                        >
                            {(
                                state.options.Components[componentIndex][
                                    currentDrawable || state.clothConfig.Components[componentIndex].Texture || 0
                                ] || []
                            ).map(value => (
                                <MenuItemSelectOption value={value} key={`${componentIndex}_texture_${value}`}>
                                    {value}
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
                            onChange={async (_, value) => {
                                await onPropChange(propIndex, 'drawable', value);
                            }}
                        >
                            {ShowRoomFreeElement[pedModel].Props[propIndex].map(value => (
                                <MenuItemSelectOption value={value} key={`${propIndex}_drawable_${value}`}>
                                    {value}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        <MenuItemSelect
                            title={`Texture`}
                            value={state.clothConfig.Props[propIndex].Texture || 0}
                            onChange={async (_, value) => {
                                await onPropChange(propIndex, 'texture', value);
                            }}
                        >
                            {(
                                state.options.Props[propIndex][
                                    currentDrawable || state.clothConfig.Props[propIndex].Texture || 0
                                ] || []
                            ).map(value => (
                                <MenuItemSelectOption value={value} key={`${propIndex}_texture_${value}`}>
                                    {value}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};