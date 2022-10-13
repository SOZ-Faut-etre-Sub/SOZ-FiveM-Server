import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { BennysOrder } from '../../../shared/job/bennys';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

export const BennysOrderMenu: FunctionComponent = () => {
    const banner = 'https://nui-img/soz/menu_job_bennys';
    const [orders, setOrders] = useState<BennysOrder[]>([]);

    useNuiEvent('bennys_order_menu', 'SetOrders', (orders: BennysOrder[]) => {
        setOrders(orders);
    });

    useState(() => {
        fetchNui(NuiEvent.BennysGetOrders).then();
    });

    return (
        <Menu type={MenuType.BennysOrderMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Gestion des commandes</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.BennysOrder);
                        }}
                    >
                        ➕ Commander un véhicule
                    </MenuItemButton>
                    {orders
                        .sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
                        .map(order => {
                            const remainingMinutes = Math.floor(
                                (new Date(order.orderDate).getTime() + 1000 * 60 * 60 - Date.now()) / 1000 / 60
                            );
                            return (
                                <MenuItemButton
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.BennysCancelOrder, order.uuid);
                                    }}
                                    key={order.uuid}
                                >
                                    ❌ {order.model.toUpperCase() + ' - ' + remainingMinutes} minutes
                                </MenuItemButton>
                            );
                        })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
