import { FunctionComponent, useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useMenuNuiEvent } from '../../hook/nui';
import { AdminMenu } from '../Admin/AdminMenu';
import { BahamaUnicornJobMenu } from '../BahamaUnicorn/BahamaUnicornJobMenu';
import { BennysOrderMenu } from '../Bennys/BennysOrderMenu';
import { FightForStyleJobMenu } from '../FightForStyle/FightForStyleJobMenu';
import { FoodJobMenu } from '../Food/FoodJobMenu';
import { BossShopMenu } from '../Shop/BossShopMenu';
import { MaskShopMenu } from '../Shop/MaskShopMenu';
import { StonkJobMenu } from '../Stonk/StonkJobMenu';
import { MenuDemo } from './MenuDemo';
import { MenuGarage } from './MenuGarage';
import { MenuSetHealthState } from './MenuSetHealthState';
import { MenuVehicle } from './MenuVehicule';
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
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState(null);

    useEffect(() => {
        if (location.pathname === '/') {
            fetchNui(NuiEvent.MenuClosed, {});
        }
    }, [location]);

    useMenuNuiEvent('SetMenuType', ({ menuType, data, subMenuId }) => {
        let path = `/`;

        if (menuType) {
            path = `/${menuType}`;

            if (subMenuId) {
                path = `${path}/${subMenuId}`;
            }
        }

        navigate(path);
        setMenuData(data);
    });

    useMenuNuiEvent('CloseMenu', () => {
        if (location.pathname !== '/') {
            navigate('/');
        }
        setMenuData(null);
    });

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
            <Route path={`/${MenuType.Garage}/*`} element={<MenuGarage data={menuData} />} />
        </Routes>
    );
};
