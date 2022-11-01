import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { VehicleAuctionMenuData } from '../../../shared/vehicle/vehicle';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type MenuVehicleAuctionProps = {
    data?: VehicleAuctionMenuData;
};

export const MenuVehicleAuction: FunctionComponent<MenuVehicleAuctionProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleAuctionBid, { name: data.name, auction: data.auction });
    };

    return (
        <Menu type={MenuType.Vehicle}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_vehicle_car">Enchère véhicules</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={onConfirm}>Faire une enchère</MenuItemButton>
                    {data.auction.bestBid && (
                        <MenuItemText>
                            Meilleur offre: ${data.auction.bestBid.name} - ${data.auction.bestBid.price}
                        </MenuItemText>
                    )}
                    {!data.auction.bestBid && <MenuItemText>Mise à prix: ${data.auction.vehicle.price}</MenuItemText>}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
