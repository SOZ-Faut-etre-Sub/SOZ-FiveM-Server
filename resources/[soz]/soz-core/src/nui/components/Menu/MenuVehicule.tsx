import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { VehicleMenuData } from '../../../shared/vehicle';
import { fetchNui } from '../../fetch';
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
    if (!data) {
        return null;
    }

    // const onConfirm = (name: string | null) => {
    //     fetchNui(NuiEvent.SetWardrobeOutfit, name ? wardrobe.wardrobe[name] || null : null);
    // };

    const onVehicleEngineChange = (value: boolean) => {
        fetchNui(NuiEvent.VehicleSetEngine, value);
    };

    const onSpeedLimit = (value: number | null) => {
        fetchNui(NuiEvent.VehicleSetSpeedLimit, value);
    };

    const createOnDoorChange = (doorIndex: number) => {
        return async value => {
            await fetchNui(NuiEvent.VehicleSetDoorOpen, { doorIndex, open: value });
        };
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
                    {data.hasRadio && <MenuItemButton>Radio longue portée</MenuItemButton>}
                    {data.isDriver && (
                        <>
                            <MenuItemSelect
                                onConfirm={(index, value) => {
                                    onSpeedLimit(value);
                                }}
                                value={data.speedLimit}
                                title="Limitateur de vitesse"
                            >
                                <MenuItemSelectOption value={null}>Aucune limite de vitesse</MenuItemSelectOption>
                                <MenuItemSelectOption value={50}>Limiter la vitesse à 50km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={90}>Limiter la vitesse à 90km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={110}>Limiter la vitesse à 110km/h</MenuItemSelectOption>
                                <MenuItemSelectOption value={130}>Limiter la vitesse à 130km/h</MenuItemSelectOption>
                            </MenuItemSelect>
                            <MenuItemSubMenuLink id="door">Gestion des portes</MenuItemSubMenuLink>
                        </>
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
