import { FunctionComponent, useEffect, useState } from 'react';

import { RGBColor } from '../../../shared/color';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    BennysUpgradeVehicleMenuData,
    VehicleColor,
    VehicleColorChoiceItem,
    VehicleColorChoices,
    VehicleConfiguration,
    VehicleModification,
    VehicleNeonLight,
    VehicleUpgradeOptions,
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
};

export const MenuItemVehicleModification: FunctionComponent<MenuItemVehicleModificationProps> = ({
    options,
    modKey,
    set,
    config,
}) => {
    const option = options.modification[modKey];

    if (!option) {
        return null;
    }

    if (option.choice.type === 'list') {
        return (
            <MenuItemSelect
                title={option.label}
                value={config.modification[modKey]}
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
                {option.choice.items.map((choice, index) => (
                    <MenuItemSelectOption key={index} value={choice.value}>
                        {choice.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
        );
    }

    if (option.choice.type === 'toggle') {
        return (
            <MenuItemCheckbox
                checked={config[modKey]}
                onChange={checked =>
                    set({
                        ...config,
                        modification: { ...config.modification, [modKey]: checked },
                    })
                }
            >
                {option.label}
            </MenuItemCheckbox>
        );
    }
};

type MenuBennysUpgradeVehicleProps = {
    data?: BennysUpgradeVehicleMenuData;
};

type MenuItemSelectVehicleColorProps<T extends number> = {
    value?: T;
    title: string;
    onChange?: (color: T) => void;
    onConfirm?: (color: T) => void;
    choices?: Partial<Record<T, VehicleColorChoiceItem>>;
};

export const MenuItemSelectVehicleColor: FunctionComponent<
    MenuItemSelectVehicleColorProps<VehicleColor | VehicleXenonColor>
> = ({ value, onChange, onConfirm, title, choices = VehicleColorChoices }) => {
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
        <MenuItemSelect distance={3} title={title} value={value} onChange={innerOnChange} onConfirm={innerOnConfirm}>
            {Object.keys(choices).map((colorString, index) => {
                const option = choices[colorString];
                const value = parseInt(colorString);

                return (
                    <MenuItemSelectOptionColor
                        color={option.color}
                        description={option.label}
                        value={value}
                        key={index}
                    />
                );
            })}
        </MenuItemSelect>
    );
};

type MenuItemSelectVehicleRGBColorProps = {
    value?: RGBColor;
    title: string;
    onChange?: (color: RGBColor) => void;
    onConfirm?: (color: RGBColor) => void;
    choices?: VehicleColorChoiceItem[];
};

export const MenuItemSelectVehicleRGBColor: FunctionComponent<MenuItemSelectVehicleRGBColorProps> = ({
    value,
    onChange,
    onConfirm,
    title,
    choices = Object.values(VehicleColorChoices),
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
        <MenuItemSelect distance={3} title={title} value={value} onChange={innerOnChange} onConfirm={innerOnConfirm}>
            {choices.map((option, index) => {
                return (
                    <MenuItemSelectOptionColor
                        color={option.color}
                        description={option.label}
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

    useEffect(() => {
        if (data?.currentConfiguration) {
            setConfig(data.currentConfiguration);
        }
    }, [data]);

    useEffect(() => {
        if (config && data) {
            fetchNui(NuiEvent.VehicleCustomApply, {
                vehicleEntityId: data.vehicle,
                vehicleConfiguration: config,
            });
        }
    }, [config]);

    if (!data) {
        return null;
    }

    const options = data.options;
    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            vehicleConfiguration: config,
        });
    };

    return (
        <Menu type={MenuType.BennysUpgradeVehicle}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Station entretien</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="colors">Couleur et aspects</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="body">Carrosserie</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="engine">Moteur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="wheel">Roues</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="interior">Intérieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="exterior">Exterieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="light">Lumières</MenuItemSubMenuLink>
                    <MenuItemButton onConfirm={() => onConfirm()}>Confirmer les changements</MenuItemButton>
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
                            title="Version"
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
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="plaques" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="speakers" options={options} config={config} set={setConfig} />
                </MenuContent>
            </SubMenu>
            <SubMenu id="body">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Carrosserie</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification modKey="spoiler" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="bumperFront"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="bumperRear"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="sideSkirt" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="exhaust" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="frame" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="grille" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="hood" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="fender" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="fenderRight"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="roof" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="trunk" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="engineBlock"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="airFilter" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="tank" options={options} config={config} set={setConfig} />
                </MenuContent>
            </SubMenu>
            <SubMenu id="engine">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Moteur</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification modKey="engine" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="brakes" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="transmission"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="suspension"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="armor" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="turbo" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="hydraulics"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                </MenuContent>
            </SubMenu>
            <SubMenu id="wheel">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Roues</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification modKey="tyreSmoke" options={options} config={config} set={setConfig} />
                    <MenuItemSelectVehicleRGBColor
                        title="Couleur de fumée des roues"
                        value={config.tyreSmokeColor}
                        onChange={color => {
                            setConfig({
                                ...config,
                                tyreSmokeColor: color,
                            });
                        }}
                    />
                    <MenuItemSelect
                        title="Type de roue"
                        value={config?.wheelType}
                        onChange={(index, value) => {
                            setConfig({
                                ...config,
                                wheelType: value,
                            });
                        }}
                    >
                        <MenuItemSelectOption value={0}>Sport</MenuItemSelectOption>
                        <MenuItemSelectOption value={1}>Muscle</MenuItemSelectOption>
                        <MenuItemSelectOption value={2}>Lowrider</MenuItemSelectOption>
                        <MenuItemSelectOption value={3}>SUV</MenuItemSelectOption>
                        <MenuItemSelectOption value={4}>Offroad</MenuItemSelectOption>
                        <MenuItemSelectOption value={5}>Tuner</MenuItemSelectOption>
                        <MenuItemSelectOption value={6}>Bike Wheels</MenuItemSelectOption>
                        <MenuItemSelectOption value={7}>High End</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemVehicleModification
                        modKey="wheelFront"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="wheelRear" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="struts" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="archCover" options={options} config={config} set={setConfig} />
                    <MenuItemSelectVehicleColor
                        value={config?.color?.rim as VehicleColor}
                        title="Couleur des jantes"
                        onChange={color => {
                            setConfig({
                                ...config,
                                color: { ...config.color, rim: color as VehicleColor },
                            });
                        }}
                    />
                </MenuContent>
            </SubMenu>
            <SubMenu id="exterior">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Exterieur</MenuTitle>
                <MenuContent>
                    <MenuItemSelect
                        title="Style plaque d'immatriculation"
                        value={config?.plateStyle}
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
                        <MenuItemSelectOption value={3}>Blue sur blanc 2</MenuItemSelectOption>
                        <MenuItemSelectOption value={4}>Blue sur blanc 3</MenuItemSelectOption>
                        <MenuItemSelectOption value={5}>Yankton</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        title="Teinte vitre"
                        value={config?.windowTint}
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
                    />
                    <MenuItemVehicleModification
                        modKey="vanityPlate"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="ornament" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="aerials" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="trim" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="windows" options={options} config={config} set={setConfig} />
                </MenuContent>
            </SubMenu>
            <SubMenu id="interior">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Intérieur</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification modKey="horn" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="dashboard" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="dialDesign"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="doorSpeaker"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="seat" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification
                        modKey="steeringWheel"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification
                        modKey="columnShifterLevers"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.interiorColor as VehicleColor}
                        title="Couleur intérieur"
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
                        onChange={color => {
                            setConfig({
                                ...config,
                                dashboardColor: color as VehicleColor,
                            });
                        }}
                    />
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
                                    ...config.neon,
                                    light: {
                                        ...config.neon.light,
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
                                    ...config.neon,
                                    light: {
                                        ...config.neon.light,
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
                                    ...config.neon,
                                    light: {
                                        ...config.neon.light,
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
                                    ...config.neon,
                                    light: {
                                        ...config.neon.light,
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
                        value={config.neon?.color}
                        onChange={color => {
                            setConfig({
                                ...config,
                                neon: {
                                    ...config.neon,
                                    color,
                                },
                            });
                        }}
                    />
                    <MenuItemVehicleModification
                        modKey="xenonHeadlights"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemSelectVehicleColor
                        value={config?.xenonColor as VehicleXenonColor}
                        title="Couleur xénon"
                        onChange={color => {
                            setConfig({
                                ...config,
                                xenonColor: color as VehicleXenonColor,
                            });
                        }}
                        choices={VehicleXenonColorChoices}
                    />
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
