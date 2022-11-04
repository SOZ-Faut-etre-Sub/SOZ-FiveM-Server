import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    BennysUpgradeVehicleMenuData,
    VehicleConfiguration,
    VehicleModification,
    VehicleUpgradeChoiceItem,
    VehicleUpgradeOptions,
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
                value={config[modKey]}
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
                    <MenuItemButton onConfirm={() => onConfirm()}>Confirmer les changements</MenuItemButton>
                    <MenuItemSubMenuLink id="colors">Couleur et aspects</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="body">Carrosserie</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="engine">Moteur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="wheel">Roues</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="interior">Intérieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="exterior">Exterieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="neon_xenon">Neon & Xénon</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <SubMenu id="colors">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Carrosserie</MenuTitle>
                <MenuContent>
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
                    <MenuItemVehicleModification
                        modKey="wheelFront"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                    <MenuItemVehicleModification modKey="wheelRear" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="struts" options={options} config={config} set={setConfig} />
                    <MenuItemVehicleModification modKey="archCover" options={options} config={config} set={setConfig} />
                </MenuContent>
            </SubMenu>
            <SubMenu id="exterior">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Exterieur</MenuTitle>
                <MenuContent>
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
                </MenuContent>
            </SubMenu>
            <SubMenu id="neon_xenon">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Néon & Xénon</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification
                        modKey="xenonHeadlights"
                        options={options}
                        config={config}
                        set={setConfig}
                    />
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
