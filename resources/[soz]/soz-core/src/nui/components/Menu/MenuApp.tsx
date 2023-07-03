import { MenuIllegalShop } from '@private/nui/illegalshop/MenuIllegalShop';
import { FunctionComponent, useLayoutEffect, useState } from 'react';
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
import { DrivingSchoolMenu } from '../DrivingSchool/DrivingSchoolMenu';
import { FightForStyleJobMenu } from '../FightForStyle/FightForStyleJobMenu';
import { FoodJobMenu } from '../Food/FoodJobMenu';
import { MenuGunSmith } from '../GunSmith/GunSmithMenu';
import { HousingUpgradesMenu } from '../Housing/HousingUpgradesMenu';
import { LsmcJobMenu } from '../LSMC/LsmcJobMenu';
import { MandatoryJobMenu } from '../Mandatory/MandatoryJobMenu';
import { EasterShopMenu } from '../Shop/EasterShopMenu';
import { MaskShopMenu } from '../Shop/MaskShopMenu';
import { StonkJobMenu } from '../Stonk/StonkJobMenu';
import { TaxiJobMenu } from '../Taxi/TaxiJobMenu';
import { MenuBennys } from './Job/MenuBennys';
import { MenuUpw } from './Job/MenuUpw';
import { MenuBennysUpgradeVehicle } from './MenuBennysUpgradeVehicle';
import { MenuDemo } from './MenuDemo';
import { MenuGarage } from './MenuGarage';
import { MenuOilSetPrice } from './MenuOilSetPrice';
import { UpwOrderMenu } from './MenuOrderUpw';
import { MenuPlayerPersonal } from './MenuPlayerPersonal';
import { MenuPropPlacement } from './MenuPropPlacement';
import { MenuSetHealthState } from './MenuSetHealthState';
import { MenuVehicle } from './MenuVehicle';
import { MenuVehicleAuction } from './MenuVehicleAuction';
import { MenuVehicleCustom } from './MenuVehicleCustom';
import { MenuVehicleDealership } from './MenuVehicleDealership';
import { MenuWardrobe } from './MenuWardrobe';

export const MenuApp: FunctionComponent = () => {
    return (
        <div className="absolute w-full h-full overflow-hidden opacity-100">
            <MemoryRouter>
                <MenuRouter />
            </MemoryRouter>
        </div>
    );
};

const MenuRouter: FunctionComponent = () => {
    const location = useLocation();
    const state = location.state as { data: any; skipCloseEvent?: boolean } | undefined;
    const menuData = state?.data || null;
    const prevData = usePrevious(menuData);
    const navigate = useNavigate();
    const [menuType, setMenuType] = useState<MenuType>(null);
    const prevMenuType = usePrevious(menuType);
    const [useFocus, setFocus] = useState(false);

    useNuiFocus(useFocus, useFocus, false);

    useControl(() => {
        if (menuType !== null) {
            setFocus(!useFocus);
        }
    });

    useLayoutEffect(() => {
        if (menuType !== null && !location.pathname.startsWith(`/${menuType}`)) {
            fetchNui(NuiEvent.MenuClosed, {
                menuType,
                nextMenu: null,
                menuData: prevData,
            });

            setMenuType(null);
            setFocus(false);

            navigate('/', {
                state: {
                    skipCloseEvent: true,
                    data: null,
                },
            });
        }

        if (prevMenuType !== null && prevMenuType !== menuType) {
            setFocus(false);

            if (!state?.skipCloseEvent) {
                fetchNui(NuiEvent.MenuClosed, {
                    menuType: prevMenuType,
                    nextMenu: menuType,
                    menuData: prevData,
                });
            }

            if (state?.skipCloseEvent && menuType === null) {
                navigate('/', {
                    state: {
                        data: null,
                        skipCloseEvent: false,
                    },
                    replace: true,
                });
            }
        }
    }, [location, menuType]);

    useMenuNuiEvent('SetMenuType', ({ menuType, data, subMenuId }) => {
        let path = `/`;

        if (menuType) {
            path = `/${menuType}`;

            if (subMenuId) {
                path = `${path}/${subMenuId}`;
            }
        }

        navigate(path, {
            state: {
                data,
            },
        });

        setMenuType(menuType);
        setFocus(false);
    });

    useMenuNuiEvent('CloseMenu', skipCloseEvent => {
        if (location.pathname !== '/') {
            navigate('/', {
                state: {
                    data: null,
                    skipCloseEvent,
                },
            });
        }
        setMenuType(null);
        setFocus(false);
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
            <Route path={`/${MenuType.SetHealthState}/*`} element={<MenuSetHealthState source={menuData} />} />
            <Route path={`/${MenuType.Wardrobe}/*`} element={<MenuWardrobe wardrobe={menuData} />} />
            <Route path={`/${MenuType.GunSmith}/*`} element={<MenuGunSmith data={menuData} />} />
            <Route path={`/${MenuType.Vehicle}/*`} element={<MenuVehicle data={menuData} />} />
            <Route path={`/${MenuType.VehicleAuction}/*`} element={<MenuVehicleAuction data={menuData} />} />
            <Route path={`/${MenuType.VehicleCustom}/*`} element={<MenuVehicleCustom data={menuData} />} />
            <Route path={`/${MenuType.VehicleDealership}/*`} element={<MenuVehicleDealership data={menuData} />} />
            <Route path={`/${MenuType.Garage}/*`} element={<MenuGarage data={menuData} />} />
            <Route path={`/${MenuType.OilSetStationPrice}/*`} element={<MenuOilSetPrice data={menuData} />} />
            <Route path={`/${MenuType.DrivingSchool}/*`} element={<DrivingSchoolMenu data={menuData} />} />
            <Route path={`/${MenuType.HousingUpgrades}/*`} element={<HousingUpgradesMenu data={menuData} />} />
            <Route path={`/${MenuType.LsmcJobMenu}/*`} element={<LsmcJobMenu data={menuData} />} />
            <Route path={`/${MenuType.MandatoryJobMenu}/*`} element={<MandatoryJobMenu data={menuData} />} />
            <Route path={`/${MenuType.IllegalShop}/*`} element={<MenuIllegalShop data={menuData} />} />
            <Route path={`/${MenuType.EasterShop}/*`} element={<EasterShopMenu data={menuData} />} />
            <Route path={`/${MenuType.TaxiJobMenu}/*`} element={<TaxiJobMenu data={menuData} />} />
            <Route path={`/${MenuType.PlayerPersonal}/*`} element={<MenuPlayerPersonal data={menuData} />} />
            <Route path={`/${MenuType.JobBennys}/*`} element={<MenuBennys data={menuData} />} />
            <Route path={`/${MenuType.JobUpw}/*`} element={<MenuUpw data={menuData} />} />
            <Route path={`/${MenuType.UpwOrderMenu}/*`} element={<UpwOrderMenu data={menuData} />} />
            <Route
                path={`/${MenuType.BennysUpgradeVehicle}/*`}
                element={<MenuBennysUpgradeVehicle data={menuData} />}
            />
            <Route path={`/${MenuType.PropPlacementMenu}/*`} element={<MenuPropPlacement data={menuData} />} />
        </Routes>
    );
};
