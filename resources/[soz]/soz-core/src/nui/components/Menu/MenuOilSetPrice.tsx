import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { FuelType } from '../../../shared/fuel';
import { JobLabel } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

type MenuOilSetPriceProps = {
    data?: Record<FuelType, number>;
};

export const MenuOilSetPrice: FunctionComponent<MenuOilSetPriceProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const onConfirm = (fuelType: FuelType, price: number) => {
        fetchNui(NuiEvent.OilAskStationPrice, {
            type: fuelType,
            price,
        });
    };

    return (
        <Menu type={MenuType.OilSetStationPrice}>
            <MainMenu>
                <MenuTitle title={JobLabel.oil} />
                <MenuContent>
                    <MenuItemButton onConfirm={() => onConfirm(FuelType.Essence, data.essence)}>
                        <div className="pr-2 flex items-center justify-between">
                            <span>Station essence</span>
                            <span>💸 ${data?.essence?.toFixed(2)}</span>
                        </div>
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => onConfirm(FuelType.Kerosene, data.kerosene)}>
                        <div className="pr-2 flex items-center justify-between">
                            <span>Station kérosène</span>
                            <span>💸 ${data.kerosene?.toFixed(2)}</span>
                        </div>
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
