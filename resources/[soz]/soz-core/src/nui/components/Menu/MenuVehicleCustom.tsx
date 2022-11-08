import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    getVehicleCustomPrice,
    VehicleConfiguration,
    VehicleCustomMenuData,
    VehicleModification,
    VehicleUpgradeChoice,
    VehicleUpgradeOption,
} from '../../../shared/vehicle/modification';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOptionBox,
    MenuTitle,
} from '../Styleguide/Menu';

type MenuItemSelectVehicleCustomLevelProps = {
    image: string;
    option: VehicleUpgradeOption<VehicleUpgradeChoice>;
    value: any;
    onChange: (value: any) => void;
    title: string;
};

export const MenuItemSelectVehicleCustomLevel: FunctionComponent<MenuItemSelectVehicleCustomLevelProps> = ({
    image,
    value,
    option,
    onChange,
    title,
}) => {
    if (!option || option.choice.type === 'toggle') {
        return null;
    }

    return (
        <MenuItemSelect
            showAllOptions
            value={value === -1 ? null : value}
            onChange={(index, value) => onChange(value)}
            title={
                <div className="flex items-center w-[9.3em]">
                    <img alt={image} className="ml-4 w-8 h-8" src={`/public/images/vehicle/${image}.png`} />
                    <h3 className="ml-2 uppercase">{title}</h3>
                </div>
            }
        >
            {option.choice.items.map((option, index) => (
                <MenuItemSelectOptionBox key={index} value={option.value}>
                    {index === 0 ? 'Origine' : index}
                </MenuItemSelectOptionBox>
            ))}
        </MenuItemSelect>
    );
};

type MenuVehicleCustomProps = {
    data?: VehicleCustomMenuData;
};

export const MenuVehicleCustom: FunctionComponent<MenuVehicleCustomProps> = ({ data }) => {
    const [configuration, setConfiguration] = useState<VehicleConfiguration | null>(null);

    useEffect(() => {
        if (data?.currentConfiguration) {
            setConfiguration(data.currentConfiguration);
        }
    }, [data]);

    useEffect(() => {
        if (configuration && data) {
            fetchNui(NuiEvent.VehicleCustomApply, {
                vehicleEntityId: data.vehicle,
                vehicleConfiguration: configuration,
            });
        }
    }, [configuration]);

    if (!data || !configuration) {
        return null;
    }

    const price = configuration
        ? getVehicleCustomPrice(data.vehiclePrice, data.options, data.currentConfiguration, configuration)
        : 0;

    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            originalConfiguration: data.originalConfiguration,
            vehicleConfiguration: configuration,
            usePricing: true,
        });
    };

    const createOnChange = (key: keyof VehicleModification) => (value: any) => {
        setConfiguration({
            ...configuration,
            modification: {
                ...configuration.modification,
                [key]: value,
            },
        });
    };

    return (
        <Menu type={MenuType.VehicleCustom}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_lscustoms">LS Customs</MenuTitle>
                <MenuContent>
                    <MenuItemSelectVehicleCustomLevel
                        value={configuration.modification.engine}
                        option={data.options.modification.engine}
                        image="engine"
                        title="Moteur"
                        onChange={createOnChange('engine')}
                    />
                    <MenuItemSelectVehicleCustomLevel
                        value={configuration.modification.brakes}
                        option={data.options.modification.brakes}
                        image="frein"
                        title="Freins"
                        onChange={createOnChange('brakes')}
                    />
                    <MenuItemSelectVehicleCustomLevel
                        value={configuration.modification.transmission}
                        option={data.options.modification.transmission}
                        image="transmission"
                        title="Transmission"
                        onChange={createOnChange('transmission')}
                    />
                    <MenuItemSelectVehicleCustomLevel
                        value={configuration.modification.suspension}
                        option={data.options.modification.suspension}
                        image="suspenssion"
                        title="Suspension"
                        onChange={createOnChange('suspension')}
                    />
                    <MenuItemSelectVehicleCustomLevel
                        value={configuration.modification.armor}
                        option={data.options.modification.armor}
                        image="blindage"
                        title="Blindage"
                        onChange={createOnChange('armor')}
                    />
                    <MenuItemSelect
                        value={!!configuration.modification.turbo}
                        showAllOptions
                        onChange={(index, value) => createOnChange('turbo')(value)}
                        title={
                            <div className="flex items-center w-[9.3rem]">
                                <img alt="Turbo" className="ml-4 w-8 h-8" src="/public/images/vehicle/turbo.png" />
                                <h3 className="ml-2 uppercase">Turbo</h3>
                            </div>
                        }
                    >
                        <MenuItemSelectOptionBox value={false}>Désactivé</MenuItemSelectOptionBox>
                        <MenuItemSelectOptionBox value={true}>Activé</MenuItemSelectOptionBox>
                    </MenuItemSelect>
                    <MenuItemButton className="border-t border-white/50" onConfirm={() => onConfirm()}>
                        <div className="flex w-full justify-between items-center">
                            <span>Confirmer les changements</span>
                            <span>${price.toFixed(0)}</span>
                        </div>
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
