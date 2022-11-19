import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { RGBColor } from '../../../shared/color';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    VehicleColor,
    VehicleColorCategory,
    VehicleColorChoiceItem,
    VehicleColorChoices,
    VehicleConfiguration,
    VehicleCustomMenuData,
    VehicleModification,
    VehicleModificationPricing,
    VehicleNeonLight,
    VehicleUpgradeOptions,
    VehicleWheelType,
    VehicleXenonColor,
    VehicleXenonColorChoices,
} from '../../../shared/vehicle/modification';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemGoBack,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSelectOptionColor,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuItemVehicleModificationProps = {
    options: VehicleUpgradeOptions;
    modKey: keyof VehicleModification;
    config: VehicleConfiguration;
    set: (configuration: VehicleConfiguration) => void;
    vehiclePrice?: number;
    useHelperText?: boolean;
    initialConfig?: VehicleConfiguration;
};

export const MenuItemVehicleModification: FunctionComponent<MenuItemVehicleModificationProps> = ({
    options,
    modKey,
    set,
    config,
    vehiclePrice,
    initialConfig,
}) => {
    const option = options.modification[modKey];
    const initialValue = useMemo(() => {
        return config.modification[modKey] === undefined ? null : config.modification[modKey];
    }, []);

    if (!option) {
        return null;
    }

    if (option.choice.type === 'list') {
        return (
            <MenuItemSelect
                title={option.label}
                value={config.modification[modKey]}
                initialValue={initialConfig?.modification[modKey] || null}
                onChange={(index, value) => {
                    if (value === null) {
                        const newModification = { ...config.modification };
                        delete newModification[modKey];

                        set({
                            ...config,
                            modification: newModification,
                        });
                    } else {
                        set({
                            ...config,
                            modification: { ...config.modification, [modKey]: value },
                        });
                    }
                }}
            >
                {option.choice.items.map((choice, index) => {
                    let price = null;

                    if (vehiclePrice && choice.value !== initialValue) {
                        price = vehiclePrice * VehicleModificationPricing[modKey].priceByLevels[choice.value] || 0;
                    }

                    return (
                        <MenuItemSelectOption key={index} value={choice.value} helper={choice.label}>
                            {choice.label}
                            {choice.value === initialValue && ' (installé)'}
                            {price !== null && ` (${price.toFixed(0)} $)`}
                        </MenuItemSelectOption>
                    );
                })}
            </MenuItemSelect>
        );
    }

    if (option.choice.type === 'toggle') {
        let price = null;

        if (vehiclePrice && config.modification[modKey] !== initialValue) {
            price =
                vehiclePrice * VehicleModificationPricing[modKey].priceByLevels[config.modification[modKey] ? 1 : 0] ||
                0;
        }

        return (
            <MenuItemCheckbox
                checked={config.modification[modKey] as boolean}
                onChange={checked =>
                    set({
                        ...config,
                        modification: { ...config.modification, [modKey]: checked },
                    })
                }
            >
                {option.label}
                {config.modification[modKey] === initialValue && ' (installé)'}
                {price !== null && ` (${price.toFixed(0)} $)`}
            </MenuItemCheckbox>
        );
    }
};

type MenuBennysUpgradeVehicleProps = {
    data?: VehicleCustomMenuData;
};

type MenuItemSelectVehicleColorProps<T extends number> = {
    value?: T;
    title: string;
    onChange?: (color: T) => void;
    onConfirm?: (color: T) => void;
    useCategory?: boolean;
    choices?: Partial<Record<T, VehicleColorChoiceItem>>;
    firstIsNone?: boolean;
    initialValue?: T;
};

export const MenuItemSelectVehicleColor: FunctionComponent<
    MenuItemSelectVehicleColorProps<VehicleColor | VehicleXenonColor>
> = ({
    value,
    useCategory,
    onChange,
    onConfirm,
    title,
    choices = VehicleColorChoices,
    firstIsNone = false,
    initialValue,
}) => {
    const [category, setCategory] = useState<VehicleColorCategory | null>(choices[value]?.category ?? null);
    const innerOnChange = (index, color) => {
        if (onChange) {
            onChange(color);
        }
    };

    const innerOnConfirm = (index, color) => {
        if (onConfirm) {
            onConfirm(color);
        }
    };

    if (!useCategory) {
        return (
            <MenuItemSelect
                title={title}
                distance={3}
                value={value}
                onChange={innerOnChange}
                onConfirm={innerOnConfirm}
                initialValue={initialValue}
            >
                {Object.keys(choices).map((colorString, index) => {
                    const option = choices[colorString];
                    const value = parseInt(colorString) as VehicleColor;

                    return (
                        <MenuItemSelectOptionColor
                            key={index}
                            color={option.color}
                            label={firstIsNone && value === 0 ? 'Aucun' : option.label}
                            value={value}
                        />
                    );
                })}
            </MenuItemSelect>
        );
    }

    const initialCategory = choices[initialValue]?.category ?? null;

    const colorList = Object.keys(choices)
        .filter(color => choices[color].category === category)
        .map(colorString => parseInt(colorString) as VehicleColor);

    return (
        <>
            <MenuItemSelect
                onChange={(index, value) => {
                    setCategory(value);
                }}
                value={category}
                initialValue={initialCategory}
                title={`Type ${title.toLowerCase()}`}
            >
                <MenuItemSelectOption value={VehicleColorCategory.Metallic}>Métallisé</MenuItemSelectOption>
                <MenuItemSelectOption value={VehicleColorCategory.Classic}>Délavé</MenuItemSelectOption>
                <MenuItemSelectOption value={VehicleColorCategory.Matte}>Mat</MenuItemSelectOption>
                <MenuItemSelectOption value={VehicleColorCategory.Pearly}>Brillante</MenuItemSelectOption>
                <MenuItemSelectOption value={VehicleColorCategory.Metal}>Métal & Chrome</MenuItemSelectOption>
            </MenuItemSelect>
            <MenuItemSelect
                distance={3}
                title={title}
                value={value}
                onChange={innerOnChange}
                onConfirm={innerOnConfirm}
                keyDescendant={category}
                initialValue={initialValue || 0}
            >
                {colorList.map((color, index) => {
                    const option = choices[color.toString()];

                    return (
                        <MenuItemSelectOptionColor
                            color={option.color}
                            label={option.label}
                            value={color}
                            key={index}
                        />
                    );
                })}
            </MenuItemSelect>
        </>
    );
};

type MenuItemSelectVehicleRGBColorProps = {
    value?: RGBColor;
    title: string;
    onChange?: (color: RGBColor) => void;
    onConfirm?: (color: RGBColor) => void;
    choices?: VehicleColorChoiceItem[];
    initialValue?: RGBColor;
};

export const MenuItemSelectVehicleRGBColor: FunctionComponent<MenuItemSelectVehicleRGBColorProps> = ({
    value,
    onChange,
    onConfirm,
    title,
    choices = Object.values(VehicleColorChoices),
    initialValue,
}) => {
    const innerOnChange = (index, color) => {
        if (onChange) {
            onChange(color);
        }
    };

    const innerOnConfirm = (index, color) => {
        if (onConfirm) {
            onConfirm(color);
        }
    };

    return (
        <MenuItemSelect
            distance={3}
            title={title}
            value={value}
            onChange={innerOnChange}
            onConfirm={innerOnConfirm}
            initialValue={initialValue}
            equalityFn={(a: RGBColor, b: RGBColor) =>
                a !== null && b !== null && a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
            }
        >
            {choices.map((option, index) => {
                console.log(option.color);

                return (
                    <MenuItemSelectOptionColor
                        color={option.color}
                        label={option.label}
                        value={option.color}
                        key={index}
                    />
                );
            })}
        </MenuItemSelect>
    );
};

export const MenuBennysUpgradeVehicle: FunctionComponent<MenuBennysUpgradeVehicleProps> = ({ data }) => {
    const [config, setConfig] = useState<VehicleConfiguration | null>(null);
    const [options, setOptions] = useState<VehicleUpgradeOptions | null>(null);

    useEffect(() => {
        if (data?.currentConfiguration) {
            setConfig(data.currentConfiguration);
        }
    }, [data]);

    const applyCustom = async (vehicle: number, config: VehicleConfiguration) => {
        const newOptions = await fetchNui(NuiEvent.VehicleCustomApply, {
            vehicleEntityId: data.vehicle,
            vehicleConfiguration: config,
        });

        if (newOptions) {
            setOptions(newOptions as VehicleUpgradeOptions);
        }
    };

    useEffect(() => {
        if (config && data) {
            applyCustom(data.vehicle, config);
        }
    }, [config]);

    useEffect(() => {
        if (data) {
            setOptions(data.options);
        }
    }, [data]);

    if (!data || !options) {
        return null;
    }

    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            originalConfiguration: data.originalConfiguration,
            vehicleConfiguration: config,
        });
    };

    const createOnDoorChange = (doorIndex: number) => {
        return async value => {
            await fetchNui(NuiEvent.VehicleSetDoorOpen, { doorIndex, open: value });
        };
    };

    return (
        <Menu type={MenuType.BennysUpgradeVehicle}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Station entretien</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="colors">Couleur et aspects</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="body">Carrosserie</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="wheel">Roues</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="interior">Intérieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="exterior">Exterieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="light">Lumières</MenuItemSubMenuLink>
                    {data.options.extra.length > 0 && <MenuItemSubMenuLink id="extra">Extras</MenuItemSubMenuLink>}
                    <MenuItemCheckbox onChange={createOnDoorChange(4)} checked={false}>
                        Ouvrir capot
                    </MenuItemCheckbox>
                    <MenuItemCheckbox onChange={createOnDoorChange(5)} checked={false}>
                        Ouvrir coffre
                    </MenuItemCheckbox>
                    <MenuItemButton onConfirm={() => onConfirm()}>✅ Confirmer les changements</MenuItemButton>
                </MenuContent>
            </MainMenu>
            <SubMenu id="colors">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Couleur et aspects</MenuTitle>
                <MenuContent>
                    {options?.livery && (
                        <MenuItemSelect
                            onChange={(index, value) => {
                                setConfig({
                                    ...config,
                                    livery: value,
                                });
                            }}
                            title="Sticker"
                            value={config?.livery}
                        >
                            {options.livery.items.map((livery, index) => (
                                <MenuItemSelectOption key={index} value={livery.value}>
                                    {livery.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                    )}
                    <MenuItemSelectVehicleColor
                        value={config?.color?.primary as VehicleColor}
                        title="Couleur principal"
                        useCategory={true}
                        initialValue={data.originalConfiguration?.color?.primary as VehicleColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                color: { ...config.color, primary: color as VehicleColor },
                            });
                        }}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.color?.secondary as VehicleColor}
                        title="Couleur secondaire"
                        useCategory={true}
                        initialValue={data.originalConfiguration?.color?.secondary as VehicleColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                color: { ...config.color, secondary: color as VehicleColor },
                            });
                        }}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.color?.pearlescent as VehicleColor}
                        title="Nacre"
                        firstIsNone={true}
                        initialValue={data.originalConfiguration?.color?.pearlescent as VehicleColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                color: { ...config.color, pearlescent: color as VehicleColor },
                            });
                        }}
                    />
                    <MenuItemVehicleModification
                        modKey="trimDesign"
                        options={options}
                        initialConfig={data?.originalConfiguration}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="plaques"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="speakers"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
            <SubMenu id="body">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Carrosserie</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="spoiler"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="bumperFront"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        modKey="bumperRear"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="sideSkirt"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="exhaust"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="frame"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="grille"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="hood"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    {/*<MenuItemVehicleModification modKey="fender" options={options} config={config} set={setConfig} />*/}
                    <MenuItemVehicleModification
                        modKey="fenderRight"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="roof"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="trunk"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="engineBlock"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="airFilter"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="tank"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="struts"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="archCover"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="hydraulics"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
            <SubMenu id="wheel">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Roues</MenuTitle>
                <MenuContent>
                    {Object.keys(options.wheelType).length > 1 && (
                        <MenuItemSelect
                            title="Type de roue"
                            value={config?.wheelType}
                            initialValue={data.originalConfiguration?.wheelType}
                            onChange={(index, value) => {
                                setConfig({
                                    ...config,
                                    wheelType: value,
                                });
                            }}
                        >
                            {Object.keys(options.wheelType).map((key, index) => {
                                const value = parseInt(key) as VehicleWheelType;
                                const label = options.wheelType[key];

                                return (
                                    <MenuItemSelectOption key={index} value={value}>
                                        {label}
                                    </MenuItemSelectOption>
                                );
                            })}
                        </MenuItemSelect>
                    )}
                    <MenuItemVehicleModification
                        modKey="wheelFront"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    {options?.modification?.wheelFront?.choice?.type === 'list' &&
                        options?.modification?.wheelFront?.choice?.items?.length > 0 && (
                            <MenuItemCheckbox
                                checked={config?.customWheelFront}
                                onChange={checked => {
                                    setConfig({
                                        ...config,
                                        customWheelFront: checked,
                                    });
                                }}
                            >
                                Pneu custom
                            </MenuItemCheckbox>
                        )}
                    <MenuItemSelectVehicleColor
                        value={config?.color?.rim as VehicleColor}
                        title="Couleur des jantes"
                        initialValue={data.originalConfiguration?.color?.rim as VehicleColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                color: { ...config.color, rim: color as VehicleColor },
                            });
                        }}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="tyreSmoke"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemSelectVehicleRGBColor
                        title="Couleur de fumée des roues"
                        value={config?.tyreSmokeColor}
                        initialValue={data.originalConfiguration?.tyreSmokeColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                tyreSmokeColor: color,
                            });
                        }}
                    />
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
            <SubMenu id="exterior">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Exterieur</MenuTitle>
                <MenuContent>
                    <MenuItemSelect
                        title="Style plaque d'immatriculation"
                        value={config?.plateStyle}
                        initialValue={data.originalConfiguration?.plateStyle}
                        onChange={(index, value) => {
                            setConfig({
                                ...config,
                                plateStyle: value,
                            });
                        }}
                    >
                        <MenuItemSelectOption value={0}>Bleu sur blanc</MenuItemSelectOption>
                        <MenuItemSelectOption value={1}>Jaune sur noir</MenuItemSelectOption>
                        <MenuItemSelectOption value={2}>Jaune sur bleu</MenuItemSelectOption>
                        <MenuItemSelectOption value={3}>Bleu sur blanc 2</MenuItemSelectOption>
                        <MenuItemSelectOption value={4}>Bleu sur blanc 3</MenuItemSelectOption>
                        <MenuItemSelectOption value={5}>Yankton</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        title="Teinte vitre"
                        value={config?.windowTint}
                        initialValue={data.originalConfiguration?.windowTint}
                        onChange={(index, value) => {
                            setConfig({
                                ...config,
                                windowTint: value,
                            });
                        }}
                    >
                        <MenuItemSelectOption value={0}>Pas de teinte</MenuItemSelectOption>
                        <MenuItemSelectOption value={1}>Teinte noire</MenuItemSelectOption>
                        <MenuItemSelectOption value={2}>Teinte noire fumée</MenuItemSelectOption>
                        <MenuItemSelectOption value={3}>Teinte légère</MenuItemSelectOption>
                        <MenuItemSelectOption value={4}>Teinte stock</MenuItemSelectOption>
                        <MenuItemSelectOption value={5}>Teinte verte</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemVehicleModification
                        modKey="plateHolder"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        modKey="vanityPlate"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="ornament"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="aerials"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="trim"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="windows"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
            <SubMenu id="interior">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Intérieur</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="horn"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="dashboard"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="dialDesign"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        modKey="doorSpeaker"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        initialConfig={data?.originalConfiguration}
                        modKey="seat"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="steeringWheel"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemVehicleModification
                        modKey="columnShifterLevers"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.interiorColor as VehicleColor}
                        title="Couleur intérieur"
                        initialValue={data.originalConfiguration?.interiorColor as VehicleColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                interiorColor: color as VehicleColor,
                            });
                        }}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.dashboardColor as VehicleColor}
                        title="Couleur du tableau de bord"
                        initialValue={data.originalConfiguration?.dashboardColor as VehicleColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                dashboardColor: color as VehicleColor,
                            });
                        }}
                    />
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
            <SubMenu id="light">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Lumières</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={config?.neon?.light[VehicleNeonLight.Front]}
                        onChange={value => {
                            setConfig({
                                ...config,
                                neon: {
                                    ...config?.neon,
                                    light: {
                                        ...config?.neon?.light,
                                        [VehicleNeonLight.Front]: value,
                                    },
                                },
                            });
                        }}
                    >
                        Néon avant
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={config?.neon?.light[VehicleNeonLight.Back]}
                        onChange={value => {
                            setConfig({
                                ...config,
                                neon: {
                                    ...config?.neon,
                                    light: {
                                        ...config?.neon?.light,
                                        [VehicleNeonLight.Back]: value,
                                    },
                                },
                            });
                        }}
                    >
                        Néon arrière
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={config?.neon?.light[VehicleNeonLight.Right]}
                        onChange={value => {
                            setConfig({
                                ...config,
                                neon: {
                                    ...config?.neon,
                                    light: {
                                        ...config?.neon?.light,
                                        [VehicleNeonLight.Right]: value,
                                    },
                                },
                            });
                        }}
                    >
                        Néon droit
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={config?.neon?.light[VehicleNeonLight.Left]}
                        onChange={value => {
                            setConfig({
                                ...config,
                                neon: {
                                    ...config?.neon,
                                    light: {
                                        ...config?.neon?.light,
                                        [VehicleNeonLight.Left]: value,
                                    },
                                },
                            });
                        }}
                    >
                        Néon gauche
                    </MenuItemCheckbox>
                    <MenuItemSelectVehicleRGBColor
                        title="Couleur des néons"
                        value={config?.neon?.color}
                        initialValue={data.originalConfiguration?.neon?.color}
                        onChange={color => {
                            if (!color) {
                                return;
                            }

                            setConfig({
                                ...config,
                                neon: {
                                    light: {},
                                    ...config?.neon,
                                    color,
                                },
                            });
                        }}
                        choices={Object.values(VehicleXenonColorChoices)}
                    />
                    <MenuItemVehicleModification
                        modKey="xenonHeadlights"
                        options={options}
                        config={config}
                        set={setConfig}
                        initialConfig={data?.originalConfiguration}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.xenonColor as VehicleXenonColor}
                        title="Couleur xénon"
                        initialValue={data.originalConfiguration?.xenonColor as VehicleXenonColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                xenonColor: color as VehicleXenonColor,
                            });
                        }}
                        choices={VehicleXenonColorChoices}
                    />
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
            <SubMenu id="extra">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Extras</MenuTitle>
                <MenuContent>
                    {options.extra?.map((extra, index) => (
                        <MenuItemCheckbox
                            key={index}
                            checked={config.extra[extra]}
                            onChange={() => {
                                setConfig({
                                    ...config,
                                    extra: {
                                        ...config.extra,
                                        [extra]: !config.extra[extra],
                                    },
                                });
                            }}
                        >
                            Extra {extra}
                        </MenuItemCheckbox>
                    ))}
                    <MenuItemGoBack />
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
