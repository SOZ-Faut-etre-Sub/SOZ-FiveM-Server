import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    getVehicleCustomPrice,
    VehicleCustomMenuData,
    VehicleLsCustomCategory,
    VehicleModification,
} from '../../../shared/vehicle/vehicle';
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
    const [modification, setModification] = useState<VehicleModification | null>(null);

    useEffect(() => {
        if (data?.currentModification) {
            setModification(data.currentModification);
        }
    }, [data]);

    useEffect(() => {
        if (modification && data) {
            fetchNui(NuiEvent.VehicleCustomApply, {
                vehicleEntityId: data.vehicle,
                vehicleModification: modification,
            });
        }
    }, [modification]);

    if (!data) {
        return null;
    }

    const price = modification ? getVehicleCustomPrice(data.custom, data.currentModification, modification) : 0;
    const onChange = <T extends keyof VehicleModification>(key: T, value: VehicleModification[T]) => {
        setModification({
            ...modification,
            [key]: value,
        });
    };
    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            vehicleModification: modification,
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
                                    onChange(key as keyof VehicleModification, value);
                                }}
                                key={key}
                                value={data.currentModification[key]}
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
