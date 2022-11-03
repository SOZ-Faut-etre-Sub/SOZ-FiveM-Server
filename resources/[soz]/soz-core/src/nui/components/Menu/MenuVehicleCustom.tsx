import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    getVehicleCustomPrice,
    VehicleConfiguration,
    VehicleCustomMenuData,
    VehicleLsCustomCategory,
} from '../../../shared/vehicle/modification';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

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

    if (!data) {
        return null;
    }

    const price = configuration ? getVehicleCustomPrice(data.custom, data.currentConfiguration, configuration) : 0;
    const onChange = <T extends keyof VehicleConfiguration>(key: T, value: VehicleConfiguration[T]) => {
        setConfiguration({
            ...configuration,
            [key]: value,
        });
    };
    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            vehicleConfiguration: configuration,
        });
    };

    return (
        <Menu type={MenuType.VehicleCustom}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_lscustoms">LS Customs</MenuTitle>
                <MenuContent>
                    {Object.keys(data.custom).map(key => {
                        const category: VehicleLsCustomCategory = data.custom[key];

                        return (
                            <MenuItemSelect
                                onChange={(index, value) => {
                                    onChange(key as keyof VehicleConfiguration, value);
                                }}
                                key={key}
                                value={data.currentConfiguration[key]}
                                title={category.label}
                            >
                                {category.levels.map((level, index) => {
                                    return (
                                        <MenuItemSelectOption value={index} key={index}>
                                            {level.name}: ${level.price}
                                        </MenuItemSelectOption>
                                    );
                                })}
                            </MenuItemSelect>
                        );
                    })}
                    <MenuItemButton onConfirm={() => onConfirm()}>Confirmer les changements: ${price}</MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
