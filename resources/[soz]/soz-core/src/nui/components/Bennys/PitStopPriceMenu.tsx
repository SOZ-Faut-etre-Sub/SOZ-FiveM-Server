import { TaxType } from '@public/shared/tax';
import { VehicleCategory } from '@public/shared/vehicle/vehicle';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { JobLabel } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useGetPrice } from '../../hook/price';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '../Styleguide/Menu';

export const PitStopPriceMenu: FunctionComponent = () => {
    const [prices, setPrices] = useState<Record<string, number>>(null);
    const getPrice = useGetPrice();

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
        <Menu type={MenuType.PitStopPriceMenu}>
            <MainMenu>
                <MenuTitle title={JobLabel.bennys} />
                <MenuContent subtitle="Gestion des Prix du Pit Stop">
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
                                        <span>💸 ${getPrice(price, TaxType.SERVICE)}</span>
                                    </div>
                                </MenuItemButton>
                            );
                        })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
