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
    [GarageType.Depot]: 'https://nui-img/soz/menu_garage_pound',
    [GarageType.House]: 'https://nui-img/soz/menu_garage_personal',
};

export const MenuGarage: FunctionComponent<MenuGarageProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const vehicleTakeOut = (id: number) => {
        fetchNui(NuiEvent.VehicleGarageTakeOut, { id: data.id, garage: data.garage, vehicle: id });
    };
    const vehicleStore = () => {
        fetchNui(NuiEvent.VehicleGarageStore, { id: data.id, garage: data.garage });
    };

    const vehicleStoreTrailer = () => {
        fetchNui(NuiEvent.VehicleGarageStoreTrailer, { id: data.id, garage: data.garage });
    };

    const garageShowPlaces = () => {
        fetchNui(NuiEvent.VehicleGarageShowPlaces, { id: data.id, garage: data.garage });
    };

    return (
        <Menu type={MenuType.Garage}>
            <MainMenu>
                <MenuTitle banner={BannerMap[data?.garage.type]}>
                    {data?.garage.name}
                    {data?.garage.type === GarageType.Private && ` | Places libres (${data?.free_places}) / 38`}
                </MenuTitle>
                <MenuContent>
                    {data.garage.type === GarageType.House && (
                        <MenuItemButton onConfirm={garageShowPlaces}>Voir la place de parking</MenuItemButton>
                    )}
                    {data?.garage.type !== GarageType.Depot && (
                        <MenuItemButton onConfirm={vehicleStore}>Ranger un véhicule</MenuItemButton>
                    )}
                    {data?.garage.type === GarageType.Job && (
                        <MenuItemButton onConfirm={vehicleStoreTrailer}>Ranger une remorque</MenuItemButton>
                    )}
                    <MenuItemSubMenuLink id={'vehicle-list'}>Sortir un véhicule</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <SubMenu id={'vehicle-list'}>
                <MenuTitle banner={BannerMap[data?.garage.type]}>
                    {data?.garage.name}
                    {data?.garage.type === GarageType.Private && ` | Places libres (${data?.free_places}) / 38`}
                </MenuTitle>
                <MenuContent>
                    {data.vehicles.length === 0 && <MenuItemButton disabled>Aucun véhicule</MenuItemButton>}
                    {data.vehicles.map(garageVehicle => (
                        <MenuItemButton
                            onConfirm={() => vehicleTakeOut(garageVehicle.vehicle.id)}
                            key={garageVehicle.vehicle.id}
                        >
                            {garageVehicle.name} | {garageVehicle.vehicle.plate}
                            {garageVehicle.price > 0 && ` - Coût: $${garageVehicle.price}`}
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
