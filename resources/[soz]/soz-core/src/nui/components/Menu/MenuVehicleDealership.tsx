import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { Vehicle, VehicleCategory, VehicleDealershipMenuData } from '../../../shared/vehicle/vehicle';
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
        if (!data.dealership) {
            return;
        }

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

    const categories: Record<
        string,
        {
            name: string;
            vehicles: Vehicle[];
        }
    > = {};

    for (const vehicle of data.vehicles) {
        if (!categories[vehicle.category]) {
            categories[vehicle.category] = {
                name: VehicleCategory[vehicle.category],
                vehicles: [],
            };
        }

        categories[vehicle.category].vehicles.push(vehicle);
    }

    const sortedCategories = Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <Menu type={MenuType.VehicleDealership}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_vehicle_car">LS Customs</MenuTitle>
                <MenuContent>
                    {sortedCategories.length > 1 &&
                        sortedCategories.map((category, index) => {
                            return (
                                <MenuItemSubMenuLink id={`category_${index}`} key={index}>
                                    {category.name}
                                </MenuItemSubMenuLink>
                            );
                        })}
                    {sortedCategories.length === 1 && (
                        <MenuVehicleList vehicles={data.vehicles} onChange={onChange} onConfirm={onConfirm} />
                    )}
                </MenuContent>
            </MainMenu>
            {sortedCategories.length > 1 &&
                sortedCategories.map((category, index) => {
                    return (
                        <SubMenu id={`category_${index}`} key={index}>
                            <MenuTitle banner="https://nui-img/soz/menu_shop_vehicle_car">{category.name}</MenuTitle>
                            <MenuContent>
                                <MenuVehicleList
                                    vehicles={category.vehicles}
                                    onChange={onChange}
                                    onConfirm={onConfirm}
                                />
                            </MenuContent>
                        </SubMenu>
                    );
                })}
        </Menu>
    );
};

type MenuVehicleListProps = {
    vehicles: Vehicle[];
    onChange: (vehicle: Vehicle) => void;
    onConfirm: (vehicle: Vehicle) => void;
};

const MenuVehicleList: FunctionComponent<MenuVehicleListProps> = ({ vehicles, onConfirm, onChange }) => {
    return (
        <>
            {vehicles.map((vehicle, index) => {
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
        </>
    );
};
