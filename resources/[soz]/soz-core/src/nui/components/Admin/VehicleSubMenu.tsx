import { VehicleSubMenuState } from '@public/shared/admin/admin';
import { FunctionComponent, useEffect, useState } from 'react';

import { SozRole } from '../../../core/permissions';
import { NuiEvent } from '../../../shared/event';
import { isOk, Result } from '../../../shared/result';
import { LSCustomMode, Vehicle, VehicleCategory } from '../../../shared/vehicle/vehicle';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type VehicleSubMenuProps = {
    permission: SozRole;
    state: VehicleSubMenuState;
};

export const VEHICLE_OPTIONS = [
    { label: 'Faire apparaître', value: 'spawn' },
    { label: 'Voir le prix', value: 'see-car-price' },
    { label: 'Changer le prix', value: 'change-car-price' },
];

type Catalog = Record<keyof VehicleCategory, Vehicle[]>;

export const VehicleSubMenu: FunctionComponent<VehicleSubMenuProps> = ({ permission, state }) => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [catalog, setCatalog] = useState<Catalog>(null);

    useEffect(() => {
        if (vehicles != null && vehicles.length === 0) {
            fetchNui<never, Result<{ vehicles: Vehicle[]; catalog: Catalog }, never>>(NuiEvent.AdminGetVehicles).then(
                result => {
                    if (isOk(result)) {
                        const { catalog, vehicles } = result.ok;
                        setVehicles(vehicles);
                        setCatalog(catalog);
                    }
                }
            );
        }
    });

    if (!vehicles || !catalog) {
        return null;
    }

    const onOpenBennysUpgrade = () => {
        fetchNui(NuiEvent.BennysUpgradeVehicle, LSCustomMode.Admin);
    };
    const onOpenLSCustom = () => {
        fetchNui(NuiEvent.VehicleOpenLSCustom, LSCustomMode.Admin);
    };

    const isStaffOrAdmin = ['staff', 'admin'].includes(permission);

    return (
        <>
            <SubMenu id="vehicle" key={'vehicle'}>
                <MenuTitle title={permission} />
                <MenuContent subtitle="ça roule vite ?">
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleSpawn);
                        }}
                    >
                        🧞 Faire apparaître un véhicule
                    </MenuItemButton>
                    <MenuItemSubMenuLink id={'vehicles_catalog'}>📝 Catalogue des véhicules</MenuItemSubMenuLink>
                    <MenuItemButton onConfirm={onOpenBennysUpgrade}>🔧 Améliorer le véhicule</MenuItemButton>
                    <MenuItemButton onConfirm={() => onOpenLSCustom()}>🚀 LS Custom</MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleRepair);
                        }}
                    >
                        ⚒ Réparer le véhicule
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleClean);
                        }}
                    >
                        🧽 Nettoyer le véhicule
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleRefill);
                        }}
                    >
                        ⛽ Ravitailler le véhicule
                    </MenuItemButton>
                    {permission == 'admin' && (
                        <>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuVehicleSetFBIConfig);
                                }}
                            >
                                👮 Configuration FBI
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.AdminMenuVehicleSave);
                                }}
                            >
                                ⚠️ Enregistrer une copie du véhicule
                            </MenuItemButton>
                        </>
                    )}
                    <MenuItemCheckbox
                        disabled={!isStaffOrAdmin}
                        checked={state.noBurstTyres}
                        onChange={async value => {
                            state.noBurstTyres = value;
                            await fetchNui(NuiEvent.AdminToggleBurstTyres, value);
                        }}
                    >
                        🞉 Pneus increvables
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        disabled={!isStaffOrAdmin}
                        checked={state.noStall}
                        onChange={async value => {
                            state.noStall = value;
                            await fetchNui(NuiEvent.AdminToggleNoStall, value);
                        }}
                    >
                        ⛍ Calage désactivé
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        disabled={!isStaffOrAdmin}
                        checked={state.noSurfaceCalc}
                        onChange={async value => {
                            state.noSurfaceCalc = value;
                            await fetchNui(NuiEvent.AdminToggleNoSurfaceCalc, value);
                        }}
                    >
                        ⛍ Surface désactivée
                    </MenuItemCheckbox>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleNos);
                        }}
                    >
                        🏎 NOS
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleMapping);
                        }}
                    >
                        🖳 Cartographie
                    </MenuItemButton>
                    <MenuItemButton
                        disabled={!isStaffOrAdmin}
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuVehicleDelete);
                        }}
                    >
                        ❌ Supprimer le véhicule
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id={'vehicles_catalog'} key={'vehicles_catalog'}>
                <MenuTitle title={permission} />
                <MenuContent subtitle="Catalogue des véhicules">
                    {Object.keys(catalog).map(category => (
                        <MenuItemSubMenuLink
                            id={'vehicles_catalog_' + category}
                            key={'vehicles_catalog_' + category + '_link'}
                        >
                            {VehicleCategory[category]}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            {Object.keys(catalog).map(category => (
                <SubMenu id={'vehicles_catalog_' + category} key={'vehicles_catalog_' + category}>
                    <MenuTitle title={permission} />
                    <MenuContent subtitle={VehicleCategory[category]}>
                        {catalog[category].map(vehicle => (
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
            ))}
        </>
    );
};
