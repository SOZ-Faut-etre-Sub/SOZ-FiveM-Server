import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { useRepository } from '@public/nui/hook/repository';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { RepositoryType } from '@public/shared/repository';
import { formatDuration } from '@public/shared/utils/timeformat';
import { VehicleOrder, VehicleOrderCostMuliplier, VehicleOrderMenuData } from '@public/shared/vehicle/vehicle';
import { FunctionComponent, useState } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type VehicleOrderMenuProps = {
    data?: VehicleOrderMenuData;
};

export const VehicleOrderMenu: FunctionComponent<VehicleOrderMenuProps> = ({ data }) => {
    const [orders, setOrders] = useState<VehicleOrder[]>([]);
    const vehicles = useRepository(RepositoryType.Vehicle);
    const player = usePlayer();
    const banner = `https://nui-img/soz/menu_job_${player.job.id}`;

    useState(() => {
        fetchNui<any, VehicleOrder[]>(NuiEvent.VehicleGetOrders, data.mode).then(orders => setOrders(orders));
    });

    const sortedCatalog = Object.values(vehicles)
        .filter(veh => data.dealerships.includes(veh.dealershipId))
        .sort((a, b) => a.model.localeCompare(b.model));

    const sortedCategories = Array.from(
        new Set(sortedCatalog.map(veh => veh.category).sort((a, b) => a.localeCompare(b)))
    );

    return (
        <Menu type={MenuType.VehicleOrderMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Gestion des commandes</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="order">➕ Commander un véhicule</MenuItemSubMenuLink>
                    {orders
                        .sort((a, b) => a.deliverDate - b.deliverDate)
                        .map(order => {
                            const vehName = vehicles[order.model].name;
                            return (
                                <MenuItemButton
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.VehicleCancelOrder, {
                                            id: order.uuid,
                                            mode: data.mode,
                                        });
                                    }}
                                    key={order.uuid}
                                >
                                    <span>{`❌ ${vehName} - ${formatDuration(Date.now() - order.deliverDate)}`}</span>
                                </MenuItemButton>
                            );
                        })}
                </MenuContent>
            </MainMenu>
            <SubMenu id="order">
                <MenuTitle banner={banner}>Catalogue des véhicules</MenuTitle>
                <MenuContent>
                    {sortedCategories.map((category, index) => {
                        return (
                            <MenuItemSubMenuLink id={`category_${index}`} key={index}>
                                {category}
                            </MenuItemSubMenuLink>
                        );
                    })}
                </MenuContent>
            </SubMenu>
            {sortedCategories.map((category, index) => {
                return (
                    <SubMenu id={`category_${index}`} key={index}>
                        <MenuTitle banner={banner}>{category}</MenuTitle>
                        <MenuContent>
                            {sortedCatalog
                                .filter(veh => veh.category == category)
                                .map(vehicle => (
                                    <MenuItemButton
                                        onConfirm={async () => {
                                            fetchNui<any, VehicleOrder[]>(NuiEvent.VehicleOrder, {
                                                model: vehicle.model,
                                                mode: data.mode,
                                            }).then(orders => setOrders(orders));
                                        }}
                                        key={vehicle.model}
                                    >
                                        <div className="pr-2 flex items-center justify-between">
                                            <span> {vehicle.name} </span>
                                            <span>
                                                💸 {Math.ceil(vehicle.price * VehicleOrderCostMuliplier[data.mode])}{' '}
                                            </span>
                                        </div>
                                    </MenuItemButton>
                                ))}
                        </MenuContent>
                    </SubMenu>
                );
            })}
        </Menu>
    );
};
