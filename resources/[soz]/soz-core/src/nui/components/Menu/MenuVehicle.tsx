import { FunctionComponent } from 'react';

import { TaxType } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { LSCustomMode, VehicleMenuData } from '../../../shared/vehicle/vehicle';
import { fetchNui } from '../../fetch';
import { useGetPrice } from '../../hook/price';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuVehicleProps = {
    data?: VehicleMenuData;
};

const DoorLabel: Record<number, string> = {
    0: 'Conducteur avant',
    1: 'Passager avant',
    2: 'Conducteur arrière',
    3: 'Passager arrière',
    4: 'Capot',
    5: 'Coffre',
};

export const MenuVehicle: FunctionComponent<MenuVehicleProps> = ({ data }) => {
    const getPrice = useGetPrice();

    if (!data) {
        return null;
    }

    const onVehicleEngineChange = (value: boolean) => {
        fetchNui(NuiEvent.VehicleSetEngine, value);
    };

    const onNeonLightStatusChange = (value: boolean) => {
        fetchNui(NuiEvent.VehicleSetNeonStatus, value);
    };

    const onSpeedLimit = (value: number | null) => {
        fetchNui(NuiEvent.VehicleSetSpeedLimit, value);
    };

    const onRadioLongRange = () => {
        fetchNui(NuiEvent.VehicleHandleRadio);
    };

    const onOpenLSCustom = (mode: LSCustomMode) => {
        fetchNui(NuiEvent.VehicleOpenLSCustom, mode);
    };

    const onOpenBennysUpgrade = (mode: LSCustomMode) => {
        fetchNui(NuiEvent.BennysUpgradeVehicle, mode);
    };

    const onPitStop = price => {
        fetchNui(NuiEvent.VehiclePitStop, price);
    };

    const createOnDoorChange = (doorIndex: number) => {
        return async value => {
            await fetchNui(NuiEvent.VehicleSetDoorOpen, { doorIndex, open: value });
        };
    };

    const onAnchorChange = (value: boolean) => {
        fetchNui(NuiEvent.VehicleAnchorChange, value);
    };

    const onPoliceDisplay = (value: boolean) => {
        fetchNui(NuiEvent.VehiclePoliceDisplay, value);
    };

    return (
        <Menu type={MenuType.Vehicle}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_vehicle">Gestion véhicule</MenuTitle>
                <MenuContent>
                    {data.isDriver && (
                        <MenuItemCheckbox onChange={onVehicleEngineChange} checked={data.engineOn}>
                            Moteur allumé
                        </MenuItemCheckbox>
                    )}
                    {data.isDriver && data.hasNeon && (
                        <MenuItemCheckbox onChange={onNeonLightStatusChange} checked={data.neonLightsStatus}>
                            Néons allumés
                        </MenuItemCheckbox>
                    )}
                    {data.hasRadio && (
                        <MenuItemButton onConfirm={() => onRadioLongRange()}>Radio longue portée</MenuItemButton>
                    )}
                    {data.isDriver && (
                        <>
                            <MenuItemSelect
                                onConfirm={(index, value) => {
                                    onSpeedLimit(value);
                                }}
                                value={data.speedLimit}
                                title="Limiteur de vitesse"
                                titleWidth={50}
                            >
                                <MenuItemSelectOption value={null}>Aucun</MenuItemSelectOption>
                                <MenuItemSelectOption value={50}>50km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={90}>90km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={110}>110km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={130}>130km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={-1}>Vitesse actuelle</MenuItemSelectOption>
                                <MenuItemSelectOption value={-2}>Personnalisé</MenuItemSelectOption>
                            </MenuItemSelect>
                            <MenuItemSubMenuLink id="door">Gestion des portes</MenuItemSubMenuLink>
                            {data.insideLSCustom && (
                                <MenuItemButton onConfirm={() => onOpenLSCustom(LSCustomMode.Normal)}>
                                    LS Custom
                                </MenuItemButton>
                            )}
                            {data.insideLSCustom && !data.onDutyNg && (
                                <MenuItemButton
                                    onConfirm={() => onPitStop(data.pitstopPrice)}
                                    description={`Prix: ${getPrice(data.pitstopPrice, TaxType.SERVICE)} $`}
                                >
                                    Pit Stop
                                </MenuItemButton>
                            )}
                            {data.crimiCustom && (
                                <MenuItemButton onConfirm={() => onOpenBennysUpgrade(LSCustomMode.Crimi)}>
                                    Modifier l'apparence
                                </MenuItemButton>
                            )}
                            {data.crimiPerformance && (
                                <MenuItemButton onConfirm={() => onOpenLSCustom(LSCustomMode.Crimi)}>
                                    Modifier les performances
                                </MenuItemButton>
                            )}
                            {data.crimiPlate && (
                                <MenuItemButton onConfirm={() => fetchNui(NuiEvent.VehicleChangePlate)}>
                                    Modifier la plaque
                                </MenuItemButton>
                            )}
                        </>
                    )}
                    {data.isDriver && data.isBoat && (
                        <MenuItemCheckbox onChange={onAnchorChange} checked={data.isAnchor}>
                            Ancre baissée
                        </MenuItemCheckbox>
                    )}
                    {data.police && (
                        <MenuItemCheckbox onChange={onPoliceDisplay} checked={data.policeLocator}>
                            Affichage des patrouilles
                        </MenuItemCheckbox>
                    )}
                </MenuContent>
            </MainMenu>
            <SubMenu id="door">
                <MenuTitle banner="https://nui-img/soz/menu_vehicle">Gestion des portes</MenuTitle>
                <MenuContent>
                    {Object.entries(data.doorStatus).map(([door, status]) => {
                        return (
                            <MenuItemCheckbox
                                onChange={createOnDoorChange(parseInt(door, 10))}
                                key={door}
                                checked={status}
                            >
                                {DoorLabel[door] || ''}
                            </MenuItemCheckbox>
                        );
                    })}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
