import { VehicleCategory } from '@public/shared/vehicle/vehicle';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

export const PitStopPriceMenu: FunctionComponent = () => {
    const banner = 'https://nui-img/soz/menu_job_bennys';
    const [prices, setPrices] = useState<Record<string, number>>(null);

    const onConfirm = async (category: VehicleCategory, price: number) => {
        const newPrices = await fetchNui<any, Record<VehicleCategory, number>>(NuiEvent.VehiclePitStopSetPrice, {
            category,
            price,
        });
        setPrices(newPrices);
    };

    useEffect(() => {
        fetchNui<any, Record<VehicleCategory, number>>(NuiEvent.VehiclePitStopPrices).then(prices => setPrices(prices));
    });

    if (!prices) {
        return;
    }

    return (
        <Menu type={MenuType.BennysOrderMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Gestion des Prix du Pit Stop</MenuTitle>
                <MenuContent>
                    {Object.entries(prices)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([category, price]) => {
                            return (
                                <MenuItemButton
                                    key={category}
                                    onConfirm={() => onConfirm(category as VehicleCategory, price)}
                                >
                                    <div className="pr-2 flex items-center justify-between">
                                        <span>{VehicleCategory[category]}</span>
                                        <span>💸 ${price}</span>
                                    </div>
                                </MenuItemButton>
                            );
                        })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
