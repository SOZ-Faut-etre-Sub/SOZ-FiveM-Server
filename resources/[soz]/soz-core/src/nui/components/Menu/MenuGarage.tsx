import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { GarageMenuData, GarageType } from '../../../shared/vehicle/garage';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuGarageProps = {
    data?: GarageMenuData;
};

const BannerMap: Record<GarageType, string> = {
    [GarageType.Public]: 'https://nui-img/soz/menu_garage_public',
    [GarageType.Private]: 'https://nui-img/soz/menu_garage_private',
    [GarageType.Job]: 'https://nui-img/soz/menu_garage_entreprise',
    [GarageType.JobLuxury]: 'https://nui-img/soz/menu_garage_entreprise',
    [GarageType.Depot]: 'https://nui-img/soz/menu_garage_pound',
    [GarageType.House]: 'https://nui-img/soz/menu_garage_personal',
};

export const MenuGarage: FunctionComponent<MenuGarageProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const showFreePlaces = data?.garage.type === GarageType.Private || data?.garage.type === GarageType.House;

    const vehicleShowPlaces = () => {
        fetchNui(NuiEvent.VehicleGarageShowPlaces, { id: data.id, garage: data.garage });
    };

    const vehicleStore = () => {
        fetchNui(NuiEvent.VehicleGarageStore, { id: data.id, garage: data.garage });
    };

    const vehicleStoreTrailer = () => {
        fetchNui(NuiEvent.VehicleGarageStoreTrailer, { id: data.id, garage: data.garage });
    };

    if (data.garage.type === GarageType.Depot) {
        return (
            <Menu type={MenuType.Garage}>
                <MainMenu>
                    <MenuTitle banner={BannerMap[data?.garage.type]}>{data?.garage.name}</MenuTitle>
                    <VehicleList data={data} />
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.Garage}>
            <MainMenu>
                <MenuTitle banner={BannerMap[data?.garage.type]}>
                    {data?.garage.name}
                    {showFreePlaces && ` | Places libres : ${data?.free_places} / ${data?.max_places}`}
                </MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="vehicles">Les véhicules</MenuItemSubMenuLink>
                    <MenuItemButton onConfirm={vehicleStore}>Ranger mon véhicule</MenuItemButton>
                    {data.garage.allowTrailers && (
                        <MenuItemButton onConfirm={vehicleStoreTrailer}>Ranger ma remorque</MenuItemButton>
                    )}
                    {data.garage.type === GarageType.House && (
                        <MenuItemButton onConfirm={vehicleShowPlaces}>Voir ma place de parking</MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
            <SubMenu id="vehicles">
                <MenuTitle banner={BannerMap[data?.garage.type]}>
                    {data?.garage.name}
                    {showFreePlaces && ` | Places libres : ${data?.free_places} / ${data?.max_places}`}
                </MenuTitle>
                <VehicleList data={data} />
            </SubMenu>
        </Menu>
    );
};

export const VehicleList: FunctionComponent<MenuGarageProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const vehicleTakeOut = (id: number) => {
        fetchNui(NuiEvent.VehicleGarageTakeOut, { id: data.id, garage: data.garage, vehicle: id });
    };

    const vehicleSetName = (id: number) => {
        fetchNui(NuiEvent.VehicleGarageSetName, { id: data.id, garage: data.garage, vehicle: id });
    };

    return (
        <MenuContent>
            {data.vehicles.length === 0 && <MenuItemButton disabled>Aucun véhicule</MenuItemButton>}
            {(data.garage.type === GarageType.Job || data.garage.type === GarageType.House) && (
                <>
                    {data.vehicles.map(garageVehicle => {
                        const name = garageVehicle.vehicle.label
                            ? `${garageVehicle.vehicle.label} | ${garageVehicle.vehicle.plate}`
                            : `${garageVehicle.name} | ${garageVehicle.vehicle.plate}`;

                        return (
                            <MenuItemSelect
                                onConfirm={(idnex, value) => {
                                    if (value === 'take_out') {
                                        vehicleTakeOut(garageVehicle.vehicle.id);
                                    }

                                    if (value === 'set_name') {
                                        vehicleSetName(garageVehicle.vehicle.id);
                                    }
                                }}
                                key={garageVehicle.vehicle.id}
                                title={name}
                                titleWidth={60}
                                description={`Kilométrage: ${(
                                    (garageVehicle.vehicle.condition.mileage || 0) / 1000
                                ).toFixed(2)}km`}
                            >
                                <MenuItemSelectOption value="take_out">Sortir</MenuItemSelectOption>
                                <MenuItemSelectOption value="set_name">Renommer</MenuItemSelectOption>
                            </MenuItemSelect>
                        );
                    })}
                </>
            )}
            {data.garage.type !== GarageType.Job && data.garage.type !== GarageType.House && (
                <>
                    {data.vehicles.map(garageVehicle => {
                        const name = garageVehicle.vehicle.label
                            ? `${garageVehicle.vehicle.label} | ${garageVehicle.vehicle.plate}`
                            : `${garageVehicle.name} | ${garageVehicle.vehicle.plate}`;
                        return (
                            <MenuItemButton
                                onConfirm={() => vehicleTakeOut(garageVehicle.vehicle.id)}
                                key={garageVehicle.vehicle.id}
                            >
                                {name}
                                {garageVehicle.price > 0 && ` - Coût: $${garageVehicle.price}`}
                            </MenuItemButton>
                        );
                    })}
                </>
            )}
        </MenuContent>
    );
};
