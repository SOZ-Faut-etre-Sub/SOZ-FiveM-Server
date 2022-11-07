import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { GarageMenuData, GarageType } from '../../../shared/vehicle/garage';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

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

    const vehicleTakeOut = (id: number) => {
        fetchNui(NuiEvent.VehicleGarageTakeOut, { id: data.id, garage: data.garage, vehicle: id });
    };

    return (
        <Menu type={MenuType.Garage}>
            <MainMenu>
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
            </MainMenu>
        </Menu>
    );
};
