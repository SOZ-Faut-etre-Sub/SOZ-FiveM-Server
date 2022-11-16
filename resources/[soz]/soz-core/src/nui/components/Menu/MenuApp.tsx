import { FunctionComponent, useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useControl } from '../../hook/control';
import { useMenuNuiEvent, useNuiFocus } from '../../hook/nui';
import { usePrevious } from '../../hook/previous';
import { AdminMenu } from '../Admin/AdminMenu';
import { BahamaUnicornJobMenu } from '../BahamaUnicorn/BahamaUnicornJobMenu';
import { BennysOrderMenu } from '../Bennys/BennysOrderMenu';
import { FightForStyleJobMenu } from '../FightForStyle/FightForStyleJobMenu';
import { FoodJobMenu } from '../Food/FoodJobMenu';
import { BossShopMenu } from '../Shop/BossShopMenu';
import { MaskShopMenu } from '../Shop/MaskShopMenu';
import { StonkJobMenu } from '../Stonk/StonkJobMenu';
import { MenuBennys } from './Job/MenuBennys';
import { MenuBennysUpgradeVehicle } from './MenuBennysUpgradeVehicle';
import { MenuDemo } from './MenuDemo';
import { MenuGarage } from './MenuGarage';
import { MenuOilSetPrice } from './MenuOilSetPrice';
import { MenuSetHealthState } from './MenuSetHealthState';
import { MenuVehicle } from './MenuVehicle';
import { MenuVehicleAuction } from './MenuVehicleAuction';
import { MenuVehicleCustom } from './MenuVehicleCustom';
import { MenuVehicleDealership } from './MenuVehicleDealership';
import { MenuWardrobe } from './MenuWardrobe';

export const MenuApp: FunctionComponent = () => {
    return (
        <MemoryRouter>
            <MenuRouter />
        </MemoryRouter>
    );
};

const MenuRouter: FunctionComponent = () => {
    const location = useLocation();
    const prevData = usePrevious(location.state);
    const navigate = useNavigate();
    const [menuType, setMenuType] = useState<MenuType>(null);
    const [useFocus, setFocus] = useState(false);

    useNuiFocus(useFocus, useFocus, !useFocus);

    useControl(() => {
        if (menuType !== null) {
            setFocus(!useFocus);
        }
    });

    useEffect(() => {
        if (location.pathname === '/' && menuType !== null && prevData !== null) {
            fetchNui(NuiEvent.MenuClosed, {
                menuType,
                menuData: prevData,
            });
            setMenuType(null);
            setFocus(false);
        }
    }, [location, menuType, prevData]);

    useMenuNuiEvent('SetMenuType', ({ menuType, data, subMenuId }) => {
        let path = `/`;

        if (menuType) {
            path = `/${menuType}`;

            if (subMenuId) {
                path = `${path}/${subMenuId}`;
            }
        }

        navigate(path, {
            state: data,
        });
        setMenuType(menuType);
        setFocus(false);
    });

    useMenuNuiEvent('CloseMenu', () => {
        if (location.pathname !== '/') {
            navigate('/', {
                state: null,
            });
        }
        setMenuType(null);
        setFocus(false);
    });

    const menuData = location.state as any;

    return (
        <Routes>
            <Route path={`/${MenuType.AdminMenu}/*`} element={<AdminMenu data={menuData} />} />
            <Route path={`/${MenuType.BahamaUnicornJobMenu}/*`} element={<BahamaUnicornJobMenu data={menuData} />} />
            <Route path={`/${MenuType.BennysOrderMenu}`} element={<BennysOrderMenu />} />
            <Route path={`/${MenuType.Demo}/*`} element={<MenuDemo />} />
            <Route path={`/${MenuType.FightForStyleJobMenu}/*`} element={<FightForStyleJobMenu data={menuData} />} />
            <Route path={`/${MenuType.StonkJobMenu}/*`} element={<StonkJobMenu data={menuData} />} />
            <Route path={`/${MenuType.FoodJobMenu}/*`} element={<FoodJobMenu data={menuData} />} />
            <Route path={`/${MenuType.MaskShop}/*`} element={<MaskShopMenu catalog={menuData} />} />
            <Route path={`/${MenuType.BossShop}/*`} element={<BossShopMenu data={menuData} />} />
            <Route path={`/${MenuType.SetHealthState}/*`} element={<MenuSetHealthState source={menuData} />} />
            <Route path={`/${MenuType.Wardrobe}/*`} element={<MenuWardrobe wardrobe={menuData} />} />
            <Route path={`/${MenuType.Vehicle}/*`} element={<MenuVehicle data={menuData} />} />
            <Route path={`/${MenuType.VehicleAuction}/*`} element={<MenuVehicleAuction data={menuData} />} />
            <Route path={`/${MenuType.VehicleCustom}/*`} element={<MenuVehicleCustom data={menuData} />} />
            <Route path={`/${MenuType.VehicleDealership}/*`} element={<MenuVehicleDealership data={menuData} />} />
            <Route path={`/${MenuType.Garage}/*`} element={<MenuGarage data={menuData} />} />
            <Route path={`/${MenuType.OilSetStationPrice}/*`} element={<MenuOilSetPrice data={menuData} />} />

            <Route path={`/${MenuType.JobBennys}/*`} element={<MenuBennys data={menuData} />} />
            <Route
                path={`/${MenuType.BennysUpgradeVehicle}/*`}
                element={<MenuBennysUpgradeVehicle data={menuData} />}
            />
        </Routes>
    );
};
