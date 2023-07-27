import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { GarageMenuData, GarageType, GarageVehicle } from '../../../shared/vehicle/garage';
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
    useMenuNavigate,
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
    const [currentVehicle, setCurrentVehicle] = useState<GarageVehicle | null>(null);

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
                    <VehicleList data={data} setCurrentVehicle={setCurrentVehicle} />
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
                <VehicleList data={data} setCurrentVehicle={setCurrentVehicle} />
            </SubMenu>
            <SubMenu id="transfer">
                <MenuTitle banner={BannerMap[data?.garage.type]}>
                    Transférer {currentVehicle?.name} - {currentVehicle?.vehicle.plate}
                </MenuTitle>
                <MenuContent>
                    {data.transferGarageList.map((garage, key) => {
                        const transferPrice = 100 + Math.round((currentVehicle?.weight / 1000) * 5);

                        return (
                            <MenuItemButton
                                key={key}
                                onConfirm={() => {
                                    fetchNui(NuiEvent.VehicleGarageTransfer, {
                                        id: currentVehicle?.vehicle.id,
                                        from: data.garage,
                                        to: garage,
                                    });
                                }}
                            >
                                <div className="flex justify-between align-items-center">
                                    <span>{garage.garage.name}</span>
                                    <span>{transferPrice}$</span>
                                </div>
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

type VehicleListProps = {
    data: GarageMenuData;
    setCurrentVehicle: (vehicle: GarageVehicle) => void;
};

export const VehicleList: FunctionComponent<VehicleListProps> = ({ data, setCurrentVehicle }) => {
    const navigateToTransfer = useMenuNavigate('transfer');

    if (!data) {
        return null;
    }

    const vehicleTakeOut = (id: number, use_ticket: boolean) => {
        fetchNui(NuiEvent.VehicleGarageTakeOut, { id: data.id, garage: data.garage, vehicle: id, use_ticket });
    };

    const vehicleSetName = (id: number) => {
        fetchNui(NuiEvent.VehicleGarageSetName, { id: data.id, garage: data.garage, vehicle: id });
    };

    const vehicleList = data.vehicles
        .map(garageVehicle => {
            const name = garageVehicle.vehicle.label
                ? `${garageVehicle.vehicle.label} | ${garageVehicle.name} | ${garageVehicle.vehicle.plate}`
                : `${garageVehicle.name} | ${garageVehicle.vehicle.plate}`;

            return {
                ...garageVehicle,
                vehicle_name: name,
            };
        })
        .sort((a, b) => {
            return a.vehicle_name.localeCompare(b.vehicle_name);
        });

    return (
        <MenuContent>
            {data.vehicles.length === 0 && <MenuItemButton disabled>Aucun véhicule</MenuItemButton>}
            {(data.garage.type === GarageType.Job || data.garage.type === GarageType.House) && (
                <>
                    {vehicleList.map(garageVehicle => {
                        return (
                            <MenuItemSelect
                                onConfirm={(idnex, value) => {
                                    if (value === 'take_out') {
                                        vehicleTakeOut(garageVehicle.vehicle.id, false);
                                    }

                                    if (value === 'set_name') {
                                        vehicleSetName(garageVehicle.vehicle.id);
                                    }
                                }}
                                key={garageVehicle.vehicle.id}
                                title={garageVehicle.vehicle_name}
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
                    {vehicleList.map(garageVehicle => {
                        return (
                            <MenuItemSelect
                                onConfirm={(index, value) => {
                                    if (value === 'take_out') {
                                        vehicleTakeOut(garageVehicle.vehicle.id, false);
                                    }

                                    if (value === 'take_out_ticket') {
                                        vehicleTakeOut(garageVehicle.vehicle.id, true);
                                    }

                                    if (value === 'transfer') {
                                        setCurrentVehicle(garageVehicle);
                                        navigateToTransfer();
                                    }
                                }}
                                key={garageVehicle.vehicle.id}
                                title={garageVehicle.vehicle_name}
                                titleWidth={60}
                                description={`Kilométrage: ${(
                                    (garageVehicle.vehicle.condition.mileage || 0) / 1000
                                ).toFixed(2)}km`}
                            >
                                <MenuItemSelectOption value="take_out">
                                    Sortir {garageVehicle.price > 0 && <span>(${garageVehicle.price})</span>}
                                </MenuItemSelectOption>
                                {garageVehicle.price > 0 &&
                                    data.has_fake_ticket &&
                                    data.garage.type === GarageType.Private && (
                                        <MenuItemSelectOption value="take_out_ticket">
                                            Utiliser un ticket
                                        </MenuItemSelectOption>
                                    )}
                                {data.garage.type === GarageType.Public && (
                                    <MenuItemSelectOption value="transfer">Transférer</MenuItemSelectOption>
                                )}
                            </MenuItemSelect>
                        );
                    })}
                </>
            )}
        </MenuContent>
    );
};
