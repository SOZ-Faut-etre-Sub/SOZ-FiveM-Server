import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type VehicleSubMenuProps = {
    banner: string;
};

export interface NuiAdminVehicleSubMenuMethodMap {
    SetVehicles: any[];
}

export const VEHICLE_OPTIONS = [
    { label: 'Faire apparaître', value: 'spawn' },
    { label: 'Voir le prix', value: 'see-car-price' },
    { label: 'Changer le prix', value: 'change-car-price' },
];

export const VehicleSubMenu: FunctionComponent<VehicleSubMenuProps> = ({ banner }) => {
    const [vehicles, setVehicles] = useState<any[]>([]);

    useNuiEvent('admin_vehicle_submenu', 'SetVehicles', setVehicles);

    useEffect(() => {
        if (vehicles != null && vehicles.length === 0) {
            fetchNui<never, any[]>(NuiEvent.AdminGetVehicles).then();
        }
    });

    if (!vehicles) {
        return null;
    }

    return (
        <>
            <SubMenu id="vehicle" key={'vehicle'}>
                <MenuTitle banner={banner}>ça roule vite ?</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleSpawn);
                        }}
                    >
                        Faire apparaître un véhicule
                    </MenuItemButton>
                    <MenuItemSubMenuLink id={'vehicles_catalog'}>Catalogue des véhicules</MenuItemSubMenuLink>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleRepair);
                        }}
                    >
                        Réparer le véhicule
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleClean);
                        }}
                    >
                        Nettoyer le véhicule
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleRefill);
                        }}
                    >
                        Ravitailler le véhicule
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleSave);
                        }}
                    >
                        Sauvegarder le véhicule
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleSetFBIConfig);
                        }}
                    >
                        Configuration FBI
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleDelete);
                        }}
                    >
                        Supprimer le véhicule
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id={'vehicles_catalog'} key={'vehicles_catalog'}>
                <MenuTitle banner={banner}>Catalogue des véhicules</MenuTitle>
                <MenuContent>
                    {vehicles.map(vehicle => (
                        <MenuItemSelect
                            title={vehicle.name}
                            key={'vehicle_' + vehicle.model}
                            onConfirm={async selectedIndex => {
                                const option = VEHICLE_OPTIONS[selectedIndex];
                                if (option.value === 'spawn') {
                                    await fetchNui(NuiEvent.AdminMenuVehicleSpawn, vehicle.model);
                                } else if (option.value === 'see-car-price') {
                                    await fetchNui(NuiEvent.AdminMenuVehicleSeeCarPrice, vehicle.model);
                                } else if (option.value === 'change-car-price') {
                                    await fetchNui(NuiEvent.AdminMenuVehicleChangeCarPrice, vehicle.model);
                                }
                            }}
                        >
                            {VEHICLE_OPTIONS.map(option => (
                                <MenuItemSelectOption key={'vehicle_option_' + option.value}>
                                    {option.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                    ))}
                </MenuContent>
            </SubMenu>
        </>
    );
};
