import { MenuDrugAdminLocation } from '@private/nui/drug/MenuDrugAdminLocation';
import { DrugGardenMenu } from '@private/nui/drug/MenuDrugGarden';
import { MenuCyber } from '@private/nui/gang/BusinessCyber/MenuCyber';
import { ContainerOrderMenu } from '@private/nui/gang/BusinessSmuggling/MenuContainerOrder';
import { SmugglingMenu } from '@private/nui/gang/BusinessSmuggling/MenuSmuggling';
import { MenuSmugglingPrices } from '@private/nui/gang/BusinessSmuggling/MenuSmugglingPrice';
import { MenuSmugglingEditZone } from '@private/nui/gang/BusinessSmuggling/MenuSmugglingZoneEdit';
import { MenuGangAdmin } from '@private/nui/gang/MenuGangAdmin';
import { MenuGangMember } from '@private/nui/gang/MenuGangMember';
import { MenuHubEntryAdmin } from '@private/nui/hub/MenuHubEntryAdmin';
import { MenuIllegalShop } from '@private/nui/illegalshop/MenuIllegalShop';
import { FunctionComponent, useLayoutEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useControl } from '../../hook/control';
import { useMenuNuiEvent, useNuiEvent, useNuiFocus } from '../../hook/nui';
import { usePrevious } from '../../hook/previous';
import { AdminMenu } from '../Admin/AdminMenu';
import { DoorAdminMenu } from '../Admin/DoorAdminMenu';
import { AdminMenuMapper } from '../Admin/Mapper/AdminMenuMapper';
import { BahamaUnicornJobMenu } from '../BahamaUnicorn/BahamaUnicornJobMenu';
import { PitStopPriceMenu } from '../Bennys/PitStopPriceMenu';
import { DrivingSchoolMenu } from '../DrivingSchool/DrivingSchoolMenu';
import { FdfJobMenu } from '../FDF/FdfJobMenu';
import { FightForStyleJobMenu } from '../FightForStyle/FightForStyleJobMenu';
import { FoodJobMenu } from '../Food/FoodJobMenu';
import { GarbageJobMenu } from '../Garbage/GarbageJobMenu';
import { MenuGunSmith } from '../GunSmith/GunSmithMenu';
import { HousingAddRoommateMenu } from '../Housing/HousingAddRoommateMenu';
import { HousingBellMenu } from '../Housing/HousingBellMenu';
import { HousingBuyMenu } from '../Housing/HousingBuyMenu';
import { HousingCloakroomMenu } from '../Housing/HousingCloakroomMenu';
import { HousingEnterMenu } from '../Housing/HousingEnterMenu';
import { HousingRemoveRoommateMenu } from '../Housing/HousingRemoveRoommateMenu';
import { HousingSellMenu } from '../Housing/HousingSellMenu';
import { HousingUpgradesMenu } from '../Housing/HousingUpgradesMenu';
import { HousingVisitMenu } from '../Housing/HousingVisitMenu';
import { JobOnDutyMenu } from '../Job/OnDutyMenu';
import { LsmcJobMenu } from '../LSMC/LsmcJobMenu';
import { LsmcPlasterMenu } from '../LSMC/LsmcPlasterMenu';
import { MandatoryJobMenu } from '../Mandatory/MandatoryJobMenu';
import { FinesMenu } from '../Police/Fines';
import { LicencesMenu } from '../Police/Licences';
import { MoneyChecker } from '../Police/MoneyChecker';
import { PoliceJobMenu } from '../Police/PoliceJobMenu';
import { MenuRaceAdmin } from '../Race/MenuRaceAdmin';
import { MenuRaceRank } from '../Race/MenuRaceRanking';
import { BarberShopMenu } from '../Shop/BarberShopMenu';
import { ClothShopMenu } from '../Shop/ClothShopMenu';
import { EasterShopMenu } from '../Shop/EasterShopMenu';
import { JewelryShopMenu } from '../Shop/JewelryShopMenu';
import { SuperetteShopMenu } from '../Shop/SuperetteShopMenu';
import { TattooShopMenu } from '../Shop/TattooShopMenu';
import { ZkeaFournitureMenu } from '../Shop/ZkeaFournitureMenu';
import { StonkJobMenu } from '../Stonk/StonkJobMenu';
import { TaxiJobMenu } from '../Taxi/TaxiJobMenu';
import { DmcJobMenu } from './Job/DmcJobMenu';
import { GouvJobMenu } from './Job/GouvJobMenu';
import { MenuBennys } from './Job/MenuBennys';
import { MenuNews } from './Job/MenuNews';
import { MenuOil } from './Job/MenuOil';
import { MenuPromote } from './Job/MenuPromote';
import { MenuUpw } from './Job/MenuUpw';
import { MenuAlbum } from './MenuAlbum';
import { MenuBennysUpgradeVehicle } from './MenuBennysUpgradeVehicle';
import { MenuDemo } from './MenuDemo';
import { MenuEditorObject } from './MenuEditorObject';
import { MenuGarage } from './MenuGarage';
import { MenuOilSetPrice } from './MenuOilSetPrice';
import { MenuPlayerPersonal } from './MenuPlayerPersonal';
import { MenuPropPlacement } from './MenuPropPlacement';
import { MenuPropPlacementHousing } from './MenuPropPlacementHousing';
import { MenuRentBoat } from './MenuRentBoat';
import { MenuRentMule } from './MenuRentMule';
import { MenuSafeStorage } from './MenuSafeStorage';
import { MenuSetHealthState } from './MenuSetHealthState';
import { MenuVehicle } from './MenuVehicle';
import { MenuVehicleAuction } from './MenuVehicleAuction';
import { MenuVehicleCustom } from './MenuVehicleCustom';
import { MenuVehicleDealership } from './MenuVehicleDealership';
import { VehicleOrderMenu } from './MenuVehicleOrder';
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
    const state = location.state as { data: any; skipCloseEvent?: boolean; originMenuType?: MenuType } | undefined;
    const menuData = state?.data || null;
    const prevData = usePrevious(menuData);
    const navigate = useNavigate();
    const [menuType, setMenuType] = useState<MenuType>(null);
    const prevMenuType = usePrevious(menuType);
    const prevOriginMenuType = usePrevious(state?.originMenuType);
    const [useFocus, setFocus] = useState(false);
    const [visibility, setVisibility] = useState(true);

    useNuiEvent('menu', 'SetMenuVisibility', (visibliity: boolean) => {
        setVisibility(visibliity);

        if (useFocus) {
            setFocus(false);
        }
    });

    useNuiFocus(useFocus, useFocus, false);

    useControl(() => {
        if (menuType !== null && visibility) {
            setFocus(!useFocus);
        }
    });

    useLayoutEffect(() => {
        if (menuType !== null && !location.pathname.startsWith(`/${menuType}`)) {
            let nextMenuType = location.pathname.split('/')[1] as MenuType;

            if (prevOriginMenuType !== nextMenuType) {
                nextMenuType = null;
            }

            fetchNui(NuiEvent.MenuClosed, {
                menuType,
                nextMenu: nextMenuType,
                menuData: prevData,
            });

            setMenuType(nextMenuType);

            if (nextMenuType === null) {
                setFocus(false);

                navigate('/', {
                    state: {
                        skipCloseEvent: true,
                        data: null,
                    },
                });
            }
        } else if (prevMenuType !== null && prevMenuType !== menuType) {
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

    useMenuNuiEvent('SetMenuType', ({ menuType, data, subMenuId, originMenuType }) => {
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
                originMenuType,
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
            <Route path={`/${MenuType.AdminMapperMenu}/*`} element={<AdminMenuMapper data={menuData} />} />
            <Route path={`/${MenuType.BahamaUnicornJobMenu}/*`} element={<BahamaUnicornJobMenu data={menuData} />} />
            <Route path={`/${MenuType.Demo}/*`} element={<MenuDemo />} />
            <Route path={`/${MenuType.FightForStyleJobMenu}/*`} element={<FightForStyleJobMenu data={menuData} />} />
            <Route path={`/${MenuType.StonkJobMenu}/*`} element={<StonkJobMenu data={menuData} />} />
            <Route path={`/${MenuType.FoodJobMenu}/*`} element={<FoodJobMenu data={menuData} />} />
            <Route path={`/${MenuType.ClothShop}/*`} element={<ClothShopMenu catalog={menuData} />} />
            <Route path={`/${MenuType.SuperetteShop}/*`} element={<SuperetteShopMenu data={menuData} />} />
            <Route path={`/${MenuType.TattooShop}/*`} element={<TattooShopMenu data={menuData} />} />
            <Route path={`/${MenuType.JewelryShop}/*`} element={<JewelryShopMenu catalog={menuData} />} />
            <Route path={`/${MenuType.BarberShop}/*`} element={<BarberShopMenu data={menuData} />} />
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
            <Route path={`/${MenuType.LsmcJobMenu}/*`} element={<LsmcJobMenu />} />
            <Route path={`/${MenuType.MandatoryJobMenu}/*`} element={<MandatoryJobMenu data={menuData} />} />
            <Route path={`/${MenuType.IllegalShop}/*`} element={<MenuIllegalShop data={menuData} />} />
            <Route path={`/${MenuType.EasterShop}/*`} element={<EasterShopMenu data={menuData} />} />
            <Route path={`/${MenuType.TaxiJobMenu}/*`} element={<TaxiJobMenu />} />
            <Route path={`/${MenuType.PlayerPersonal}/*`} element={<MenuPlayerPersonal data={menuData} />} />
            <Route path={`/${MenuType.JobOnDutyMenu}/*`} element={<JobOnDutyMenu data={menuData} />} />
            <Route path={`/${MenuType.DrugGarden}/*`} element={<DrugGardenMenu data={menuData} />} />
            <Route path={`/${MenuType.DrugAdmin}/*`} element={<MenuDrugAdminLocation />} />

            <Route path={`/${MenuType.JobBennys}/*`} element={<MenuBennys data={menuData} />} />
            <Route path={`/${MenuType.JobUpw}/*`} element={<MenuUpw data={menuData} />} />
            <Route path={`/${MenuType.JobOil}/*`} element={<MenuOil data={menuData} />} />
            <Route path={`/${MenuType.VehicleOrderMenu}/*`} element={<VehicleOrderMenu data={menuData} />} />
            <Route path={`/${MenuType.GarbageJobMenu}/*`} element={<GarbageJobMenu data={menuData} />} />
            <Route
                path={`/${MenuType.BennysUpgradeVehicle}/*`}
                element={<MenuBennysUpgradeVehicle data={menuData} />}
            />
            <Route path={`/${MenuType.Album}/*`} element={<MenuAlbum data={menuData} />} />
            <Route path={`/${MenuType.RentBoat}/*`} element={<MenuRentBoat />} />
            <Route path={`/${MenuType.RentMule}/*`} element={<MenuRentMule />} />
            <Route path={`/${MenuType.RaceAdmin}/*`} element={<MenuRaceAdmin data={menuData} />} />
            <Route path={`/${MenuType.RaceRank}/*`} element={<MenuRaceRank data={menuData} />} />
            <Route path={`/${MenuType.GouvJobMenu}/*`} element={<GouvJobMenu data={menuData} />} />
            <Route path={`/${MenuType.PropPlacementMenu}/*`} element={<MenuPropPlacement data={menuData} />} />
            <Route
                path={`/${MenuType.HousingPropPlacementMenu}/*`}
                element={<MenuPropPlacementHousing data={menuData} />}
            />
            <Route path={`/${MenuType.FDFJobMenu}/*`} element={<FdfJobMenu data={menuData} />} />
            <Route path={`/${MenuType.JobNews}/*`} element={<MenuNews data={menuData} />} />
            <Route path={`/${MenuType.DmcJobMenu}/*`} element={<DmcJobMenu data={menuData} />} />
            <Route path={`/${MenuType.PoliceJobLicences}/*`} element={<LicencesMenu data={menuData} />} />
            <Route path={`/${MenuType.PoliceJobFines}/*`} element={<FinesMenu data={menuData} />} />
            <Route path={`/${MenuType.PoliceJobMenu}/*`} element={<PoliceJobMenu data={menuData} />} />
            <Route path={`/${MenuType.PoliceJobMoneychecker}/*`} element={<MoneyChecker data={menuData} />} />
            <Route path={`/${MenuType.PitStopPriceMenu}/*`} element={<PitStopPriceMenu />} />
            <Route path={`/${MenuType.Promote}/*`} element={<MenuPromote data={menuData} />} />
            <Route path={`/${MenuType.HubEntryAdmin}/*`} element={<MenuHubEntryAdmin />} />
            <Route
                path={`/${MenuType.HousingAddRoommateMenu}/*`}
                element={<HousingAddRoommateMenu data={menuData} />}
            />
            <Route path={`/${MenuType.HousingBellMenu}/*`} element={<HousingBellMenu data={menuData} />} />
            <Route path={`/${MenuType.HousingBuyMenu}/*`} element={<HousingBuyMenu data={menuData} />} />
            <Route path={`/${MenuType.HousingCloakroomMenu}/*`} element={<HousingCloakroomMenu data={menuData} />} />
            <Route path={`/${MenuType.ZkeaFournitureMenu}/*`} element={<ZkeaFournitureMenu />} />
            <Route path={`/${MenuType.HousingEnterMenu}/*`} element={<HousingEnterMenu data={menuData} />} />
            <Route
                path={`/${MenuType.HousingRemoveRoommateMenu}/*`}
                element={<HousingRemoveRoommateMenu data={menuData} />}
            />
            <Route path={`/${MenuType.HousingSellMenu}/*`} element={<HousingSellMenu data={menuData} />} />
            <Route path={`/${MenuType.HousingVisitMenu}/*`} element={<HousingVisitMenu data={menuData} />} />
            <Route path={`/${MenuType.LsmcPlaster}/*`} element={<LsmcPlasterMenu data={menuData} />} />
            <Route path={`/${MenuType.ObjectEditor}/*`} element={<MenuEditorObject data={menuData} />} />
            <Route path={`/${MenuType.GangAdmin}/*`} element={<MenuGangAdmin />} />
            <Route path={`/${MenuType.DoorAdmin}/*`} element={<DoorAdminMenu data={menuData} />} />
            <Route path={`/${MenuType.GangMember}/*`} element={<MenuGangMember />} />
            <Route path={`/${MenuType.SafeStorage}/*`} element={<MenuSafeStorage data={menuData} />} />
            <Route
                path={`/${MenuType.SmugglingBlackMarketPrices}/*`}
                element={<MenuSmugglingPrices data={menuData} />}
            />
            <Route path={`/${MenuType.SmugglingContainerOrderMenu}/*`} element={<ContainerOrderMenu />} />
            <Route path={`/${MenuType.SmugglingMenu}/*`} element={<SmugglingMenu />} />
            <Route path={`/${MenuType.SmugglingZoneEditMenu}/*`} element={<MenuSmugglingEditZone />} />
            <Route path={`/${MenuType.CyberMenu}/*`} element={<MenuCyber />} />
        </Routes>
    );
};
