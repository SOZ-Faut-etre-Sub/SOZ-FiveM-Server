import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import {
    getVehicleCustomPrice,
    VehicleConfiguration,
    VehicleCustomMenuData,
    VehicleLsCustomCategory,
} from '../../../shared/vehicle/modification';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';
import { MenuItemVehicleModification } from './MenuBennysUpgradeVehicle';

type MenuVehicleCustomProps = {
    data?: VehicleCustomMenuData;
};

export const MenuVehicleCustom: FunctionComponent<MenuVehicleCustomProps> = ({ data }) => {
    const [configuration, setConfiguration] = useState<VehicleConfiguration | null>(null);

    useEffect(() => {
        if (data?.currentConfiguration) {
            setConfiguration(data.currentConfiguration);
        }
    }, [data]);

    useEffect(() => {
        if (configuration && data) {
            fetchNui(NuiEvent.VehicleCustomApply, {
                vehicleEntityId: data.vehicle,
                vehicleConfiguration: configuration,
            });
        }
    }, [configuration]);

    if (!data || !configuration) {
        return null;
    }

    const price = configuration
        ? getVehicleCustomPrice(data.vehiclePrice, data.options, data.currentConfiguration, configuration)
        : 0;

    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            vehicleConfiguration: configuration,
            usePricing: true,
        });
    };

    return (
        <Menu type={MenuType.VehicleCustom}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_shop_lscustoms">LS Customs</MenuTitle>
                <MenuContent>
                    <MenuItemVehicleModification
                        config={configuration}
                        modKey="engine"
                        vehiclePrice={data.vehiclePrice}
                        set={setConfiguration}
                        options={data.options}
                    />
                    <MenuItemVehicleModification
                        config={configuration}
                        modKey="brakes"
                        vehiclePrice={data.vehiclePrice}
                        set={setConfiguration}
                        options={data.options}
                    />
                    <MenuItemVehicleModification
                        config={configuration}
                        modKey="transmission"
                        vehiclePrice={data.vehiclePrice}
                        set={setConfiguration}
                        options={data.options}
                    />
                    <MenuItemVehicleModification
                        config={configuration}
                        modKey="suspension"
                        vehiclePrice={data.vehiclePrice}
                        set={setConfiguration}
                        options={data.options}
                    />
                    <MenuItemVehicleModification
                        config={configuration}
                        modKey="armor"
                        vehiclePrice={data.vehiclePrice}
                        set={setConfiguration}
                        options={data.options}
                    />
                    <MenuItemVehicleModification
                        config={configuration}
                        modKey="turbo"
                        vehiclePrice={data.vehiclePrice}
                        set={setConfiguration}
                        options={data.options}
                    />
                    <MenuItemButton onConfirm={() => onConfirm()}>Confirmer les changements: ${price}</MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
