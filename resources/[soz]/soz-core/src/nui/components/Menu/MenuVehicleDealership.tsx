import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { Vehicle, VehicleDealershipMenuData } from '../../../shared/vehicle/vehicle';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuVehicleDealershipProps = {
    data?: VehicleDealershipMenuData;
};

export const MenuVehicleDealership: FunctionComponent<MenuVehicleDealershipProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const onChange = (vehicle: Vehicle) => {
        fetchNui(NuiEvent.VehicleDealershipShowVehicle, {
            vehicle,
            dealership: data.dealership,
        });
    };
    const onConfirm = (vehicle: Vehicle) => {
        fetchNui(NuiEvent.VehicleDealershipBuyVehicle, {
            vehicle,
            dealershipId: data.dealershipId,
            dealership: data.dealership,
        });
    };

    return (
        <Menu type={MenuType.VehicleDealership}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_vehicle_car">LS Customs</MenuTitle>
                <MenuContent>
                    {data.categories.map((category, index) => {
                        return (
                            <MenuItemSubMenuLink id={`category_${index}`} key={index}>
                                {category.name}
                            </MenuItemSubMenuLink>
                        );
                    })}
                </MenuContent>
            </MainMenu>
            {data.categories.map((category, index) => {
                return (
                    <SubMenu id={`category_${index}`} key={index}>
                        <MenuTitle banner="https://nui-img/soz/menu_shop_vehicle_car">{category.name}</MenuTitle>
                        <MenuContent>
                            {category.vehicles.map((vehicle, index) => {
                                return (
                                    <MenuItemButton
                                        key={index}
                                        onSelected={() => onChange(vehicle)}
                                        onConfirm={() => onConfirm(vehicle)}
                                        disabled={vehicle.stock === 0}
                                        selectable={true}
                                    >
                                        <div className="pr-2 flex items-center justify-between">
                                            <span>{vehicle.name} </span>
                                            <span>💸 ${vehicle.price}</span>
                                        </div>
                                    </MenuItemButton>
                                );
                            })}
                        </MenuContent>
                    </SubMenu>
                );
            })}
        </Menu>
    );
};
