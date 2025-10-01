import { MenuBlackjack } from '@private/nui/casino/MenuBlackjack';
import { MenuCasinoSubscription } from '@private/nui/casino/MenuCasinoSubscription';
import { MenuInsideTrack } from '@private/nui/casino/MenuInsideTrack';
import { MenuLuckyWheel } from '@private/nui/casino/MenuLuckyWheel';
import { MenuPoker } from '@private/nui/casino/MenuPoker';
import { MenuRoulette } from '@private/nui/casino/MenuRoulette';
import { MenuSlotMachine } from '@private/nui/casino/MenuSlotMachine';
import { MenuDrugAdminLocation } from '@private/nui/drug/MenuDrugAdminLocation';
import { DrugGardenMenu } from '@private/nui/drug/MenuDrugGarden';
import { BusinessCyberMenuAlertInjector } from '@private/nui/gang/BusinessCyber/BusinessCyberMenuAlertInjector';
import { ContainerOrderMenu } from '@private/nui/gang/BusinessSmuggling/MenuContainerOrder';
import { SmugglingMenu } from '@private/nui/gang/BusinessSmuggling/MenuSmuggling';
import { MenuSmugglingOwners } from '@private/nui/gang/BusinessSmuggling/MenuSmugglingOwners';
import { MenuSmugglingPrices } from '@private/nui/gang/BusinessSmuggling/MenuSmugglingPrice';
import { MenuGangVehicule } from '@private/nui/gang/BusinessVehicle/MenuGangVehicule';
import { MenuGang } from '@private/nui/gang/MenuGang';
import { MenuGangAdmin } from '@private/nui/gang/MenuGangAdmin';
import { MenuGangMember } from '@private/nui/gang/MenuGangMember';
import { MenuGangZoneEdit } from '@private/nui/gang/MenuGangZoneEdit';
import { MenuHubEntryAdmin } from '@private/nui/hub/MenuHubEntryAdmin';
import { MenuIllegalShop } from '@private/nui/illegalshop/MenuIllegalShop';
import { AdminMenu } from '@public/nui/components/Admin/AdminMenu';
import { DoorAdminMenu } from '@public/nui/components/Admin/DoorAdminMenu';
import { AdminMenuMapper } from '@public/nui/components/Admin/Mapper/AdminMenuMapper';
import { BahamaUnicornJobMenu } from '@public/nui/components/BahamaUnicorn/BahamaUnicornJobMenu';
import { PitStopPriceMenu } from '@public/nui/components/Bennys/PitStopPriceMenu';
import { DrivingSchoolMenu } from '@public/nui/components/DrivingSchool/DrivingSchoolMenu';
import { FdfJobMenu } from '@public/nui/components/FDF/FdfJobMenu';
import { FightForStyleJobMenu } from '@public/nui/components/FightForStyle/FightForStyleJobMenu';
import { FoodJobMenu } from '@public/nui/components/Food/FoodJobMenu';
import { MenuLaserGameAdmin } from '@public/nui/components/Games/MenuLaserGameAdmin';
import { MenuLaserGameCreate } from '@public/nui/components/Games/MenuLaserGameCreate';
import { MenuLaserGameManage } from '@public/nui/components/Games/MenuLaserGameManage';
import { GarbageJobMenu } from '@public/nui/components/Garbage/GarbageJobMenu';
import { MenuGunSmith } from '@public/nui/components/GunSmith/GunSmithMenu';
import { HousingAddRoommateMenu } from '@public/nui/components/Housing/HousingAddRoommateMenu';
import { HousingAddTenantMenu } from '@public/nui/components/Housing/HousingAddTenantMenu';
import { HousingBellMenu } from '@public/nui/components/Housing/HousingBellMenu';
import { HousingBuyMenu } from '@public/nui/components/Housing/HousingBuyMenu';
import { HousingChangePrincipalApartementMenu } from '@public/nui/components/Housing/HousingChangePrincipalApartementMenu';
import { HousingCloakroomMenu } from '@public/nui/components/Housing/HousingCloakroomMenu';
import { HousingEnterMenu } from '@public/nui/components/Housing/HousingEnterMenu';
import { HousingRemoveRoommateMenu } from '@public/nui/components/Housing/HousingRemoveRoommateMenu';
import { HousingRemoveTenantMenu } from '@public/nui/components/Housing/HousingRemoveTenantMenu';
import { HousingSearchWarrantMenu } from '@public/nui/components/Housing/HousingSearchWarrantMenu';
import { HousingSearchWarrantCloseMenu } from '@public/nui/components/Housing/HousingSearchWarrantMenuClose';
import { HousingSellMenu } from '@public/nui/components/Housing/HousingSellMenu';
import { HousingStoreFounitureSelectMenu } from '@public/nui/components/Housing/HousingStoreFounitureSelectMenu';
import { HousingUpgradesMenu } from '@public/nui/components/Housing/HousingUpgradesMenu';
import { HousingUpgradesSelectMenu } from '@public/nui/components/Housing/HousingUpgradesSelectMenu';
import { HousingVisitMenu } from '@public/nui/components/Housing/HousingVisitMenu';
import { JobOnDutyMenu } from '@public/nui/components/Job/OnDutyMenu';
import { LsmcJobMenu } from '@public/nui/components/LSMC/LsmcJobMenu';
import { LsmcPlasterMenu } from '@public/nui/components/LSMC/LsmcPlasterMenu';
import { MandatoryJobMenu } from '@public/nui/components/Mandatory/MandatoryJobMenu';
import { DmcJobMenu } from '@public/nui/components/Menu/Job/DmcJobMenu';
import { GouvJobMenu } from '@public/nui/components/Menu/Job/GouvJobMenu';
import { MenuBennys } from '@public/nui/components/Menu/Job/MenuBennys';
import { MenuNews } from '@public/nui/components/Menu/Job/MenuNews';
import { MenuOil } from '@public/nui/components/Menu/Job/MenuOil';
import { MenuPawl } from '@public/nui/components/Menu/Job/MenuPawl';
import { MenuPromote } from '@public/nui/components/Menu/Job/MenuPromote';
import { MenuUpw } from '@public/nui/components/Menu/Job/MenuUpw';
import { MenuAlbum } from '@public/nui/components/Menu/MenuAlbum';
import { MenuBennysUpgradeVehicle } from '@public/nui/components/Menu/MenuBennysUpgradeVehicle';
import { MenuDemo } from '@public/nui/components/Menu/MenuDemo';
import { MenuEditorObject } from '@public/nui/components/Menu/MenuEditorObject';
import { MenuGarage } from '@public/nui/components/Menu/MenuGarage';
import { MenuHalloweenVampire } from '@public/nui/components/Menu/MenuHalloweenVampire';
import { MenuOilSetPrice } from '@public/nui/components/Menu/MenuOilSetPrice';
import { MenuPlayerPersonal } from '@public/nui/components/Menu/MenuPlayerPersonal';
import { MenuPropPlacement } from '@public/nui/components/Menu/MenuPropPlacement';
import { MenuPropPlacementHousing } from '@public/nui/components/Menu/MenuPropPlacementHousing';
import { MenuRentBoat } from '@public/nui/components/Menu/MenuRentBoat';
import { MenuRentMule } from '@public/nui/components/Menu/MenuRentMule';
import { MenuSetHealthState } from '@public/nui/components/Menu/MenuSetHealthState';
import { MenuVehicle } from '@public/nui/components/Menu/MenuVehicle';
import { MenuVehicleAuction } from '@public/nui/components/Menu/MenuVehicleAuction';
import { MenuVehicleCustom } from '@public/nui/components/Menu/MenuVehicleCustom';
import { MenuVehicleDealership } from '@public/nui/components/Menu/MenuVehicleDealership';
import { VehicleOrderMenu } from '@public/nui/components/Menu/MenuVehicleOrder';
import { MenuWardrobe } from '@public/nui/components/Menu/MenuWardrobe';
import { MenuWatch } from '@public/nui/components/Menu/MenuWatch';
import { PetJobKennelMenu } from '@public/nui/components/Pet/PetJobKennelMenu';
import { FinesMenu } from '@public/nui/components/Police/Fines';
import { LicencesMenu } from '@public/nui/components/Police/Licences';
import { MoneyChecker } from '@public/nui/components/Police/MoneyChecker';
import { PoliceJobMenu } from '@public/nui/components/Police/PoliceJobMenu';
import { PoliceSwatPickCaseMenu } from '@public/nui/components/Police/PoliceSwatPickCase';
import { MenuRaceAdmin } from '@public/nui/components/Race/MenuRaceAdmin';
import { MenuRaceRank } from '@public/nui/components/Race/MenuRaceRanking';
import { BarberShopMenu } from '@public/nui/components/Shop/BarberShopMenu';
import { EasterShopMenu } from '@public/nui/components/Shop/EasterShopMenu';
import { JewelryEngraveShopMenu } from '@public/nui/components/Shop/JewelryEngraveShopMenu';
import { JewelryShopMenu } from '@public/nui/components/Shop/JewelryShopMenu';
import { PetShopMenu } from '@public/nui/components/Shop/PetShopMenu';
import { SuperetteShopMenu } from '@public/nui/components/Shop/SuperetteShopMenu';
import { TattooShopMenu } from '@public/nui/components/Shop/TattooShopMenu';
import { ZkeaFournitureMenu } from '@public/nui/components/Shop/ZkeaFournitureMenu';
import { StonkJobMenu } from '@public/nui/components/Stonk/StonkJobMenu';
import { TaxiJobMenu } from '@public/nui/components/Taxi/TaxiJobMenu';
import { MenuTraveling } from '@public/nui/components/Traveling/MenuTraveling';
import { fetchNui } from '@public/nui/fetch';
import { useTab } from '@public/nui/hook/control';
import { useMenuNuiEvent, useNuiEvent, useNuiFocus } from '@public/nui/hook/nui';
import { usePrevious } from '@public/nui/hook/previous';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FunctionComponent, useLayoutEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { MenuWhatIfHammer } from './MenuWhatIfHammer';

export const MenuApp: FunctionComponent = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden opacity-100">
            <MemoryRouter>
                <MenuRouter />
            </MemoryRouter>
        </div>
    );
};

const menuFocus = atom<boolean>(false);

const MenuRouter: FunctionComponent = () => {
    const location = useLocation();
    const state = location.state as { data: any; skipCloseEvent?: boolean; originMenuType?: MenuType } | undefined;
    const menuData = state?.data || null;
    const prevData = usePrevious(menuData);
    const navigate = useNavigate();
    const [menuType, setMenuType] = useState<MenuType>(null);
    const prevMenuType = usePrevious(menuType);
    const prevOriginMenuType = usePrevious(state?.originMenuType);
    const useFocus = useAtomValue(menuFocus);
    const setFocus = useSetAtom(menuFocus);
    const [visibility, setVisibility] = useState(true);

    useNuiEvent('menu', 'SetMenuVisibility', setVisibility);

    useNuiFocus(useFocus && visibility && menuType !== null, useFocus && visibility && menuType !== null, false);

    useTab(() => {
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
                navigate('/', {
                    state: {
                        skipCloseEvent: true,
                        data: null,
                    },
                });
            }
        } else if (prevMenuType !== null && prevMenuType !== menuType) {
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
            <Route path={`/${MenuType.SuperetteShop}/*`} element={<SuperetteShopMenu data={menuData} />} />
            <Route path={`/${MenuType.TattooShop}/*`} element={<TattooShopMenu data={menuData} />} />
            <Route path={`/${MenuType.JewelryShop}/*`} element={<JewelryShopMenu catalog={menuData} />} />
            <Route path={`/${MenuType.JewelryEngraveShop}/*`} element={<JewelryEngraveShopMenu data={menuData} />} />
            <Route path={`/${MenuType.BarberShop}/*`} element={<BarberShopMenu data={menuData} />} />
            <Route path={`/${MenuType.PetShop}/*`} element={<PetShopMenu data={menuData} />} />
            <Route path={`/${MenuType.PetJobKennel}/*`} element={<PetJobKennelMenu data={menuData} />} />
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
            <Route path={`/${MenuType.JobPawl}/*`} element={<MenuPawl data={menuData} />} />
            <Route path={`/${MenuType.VehicleOrderMenu}/*`} element={<VehicleOrderMenu data={menuData} />} />
            <Route path={`/${MenuType.GarbageJobMenu}/*`} element={<GarbageJobMenu data={menuData} />} />
            <Route
                path={`/${MenuType.BennysUpgradeVehicle}/*`}
                element={<MenuBennysUpgradeVehicle data={menuData} />}
            />
            <Route path={`/${MenuType.Album}/*`} element={<MenuAlbum data={menuData} />} />
            <Route path={`/${MenuType.RentBoat}/*`} element={<MenuRentBoat />} />
            <Route path={`/${MenuType.RentMule}/*`} element={<MenuRentMule />} />
            <Route path={`/${MenuType.RaceAdmin}/*`} element={<MenuRaceAdmin />} />
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
            <Route path={`/${MenuType.PoliceSwatPickCase}/*`} element={<PoliceSwatPickCaseMenu />} />
            <Route path={`/${MenuType.PitStopPriceMenu}/*`} element={<PitStopPriceMenu />} />
            <Route path={`/${MenuType.Promote}/*`} element={<MenuPromote data={menuData} />} />
            <Route path={`/${MenuType.HubEntryAdmin}/*`} element={<MenuHubEntryAdmin />} />
            <Route
                path={`/${MenuType.HousingAddRoommateMenu}/*`}
                element={<HousingAddRoommateMenu data={menuData} />}
            />
            <Route path={`/${MenuType.HousingAddTenantMenu}/*`} element={<HousingAddTenantMenu data={menuData} />} />
            <Route
                path={`/${MenuType.HousingChangePrincipalApartementMenu}/*`}
                element={<HousingChangePrincipalApartementMenu data={menuData} />}
            />
            <Route path={`/${MenuType.HousingBellMenu}/*`} element={<HousingBellMenu data={menuData} />} />
            <Route
                path={`/${MenuType.HousingSearchWarrantMenu}/*`}
                element={<HousingSearchWarrantMenu data={menuData} />}
            />
            <Route
                path={`/${MenuType.HousingSearchWarrantCloseMenu}/*`}
                element={<HousingSearchWarrantCloseMenu data={menuData} />}
            />
            <Route
                path={`/${MenuType.HousingUpgradesSelectMenu}/*`}
                element={<HousingUpgradesSelectMenu data={menuData} />}
            />
            <Route path={`/${MenuType.HousingBuyMenu}/*`} element={<HousingBuyMenu data={menuData} />} />
            <Route path={`/${MenuType.HousingCloakroomMenu}/*`} element={<HousingCloakroomMenu data={menuData} />} />
            <Route path={`/${MenuType.ZkeaFournitureMenu}/*`} element={<ZkeaFournitureMenu />} />
            <Route path={`/${MenuType.HousingEnterMenu}/*`} element={<HousingEnterMenu data={menuData} />} />
            <Route
                path={`/${MenuType.HousingStoreFounitureSelectMenu}/*`}
                element={<HousingStoreFounitureSelectMenu data={menuData} />}
            />
            <Route
                path={`/${MenuType.HousingRemoveRoommateMenu}/*`}
                element={<HousingRemoveRoommateMenu data={menuData} />}
            />
            <Route
                path={`/${MenuType.HousingRemoveTenantMenu}/*`}
                element={<HousingRemoveTenantMenu data={menuData} />}
            />
            <Route path={`/${MenuType.HousingSellMenu}/*`} element={<HousingSellMenu data={menuData} />} />
            <Route path={`/${MenuType.HousingVisitMenu}/*`} element={<HousingVisitMenu data={menuData} />} />
            <Route path={`/${MenuType.LsmcPlaster}/*`} element={<LsmcPlasterMenu data={menuData} />} />
            <Route path={`/${MenuType.ObjectEditor}/*`} element={<MenuEditorObject data={menuData} />} />
            <Route path={`/${MenuType.GangAdmin}/*`} element={<MenuGangAdmin />} />
            <Route path={`/${MenuType.DoorAdmin}/*`} element={<DoorAdminMenu data={menuData} />} />
            <Route path={`/${MenuType.GangMember}/*`} element={<MenuGangMember />} />
            <Route
                path={`/${MenuType.SmugglingBlackMarketPrices}/*`}
                element={<MenuSmugglingPrices data={menuData} />}
            />
            <Route path={`/${MenuType.SmugglingContainerOrderMenu}/*`} element={<ContainerOrderMenu />} />
            <Route path={`/${MenuType.SmugglingMenu}/*`} element={<SmugglingMenu />} />
            <Route path={`/${MenuType.GangZoneEditMenu}/*`} element={<MenuGangZoneEdit data={menuData} />} />
            <Route path={`/${MenuType.GangMenu}/*`} element={<MenuGang />} />
            <Route path={`/${MenuType.GangVehiculeMenu}/*`} element={<MenuGangVehicule />} />
            <Route path={`/${MenuType.WatchMenu}/*`} element={<MenuWatch data={menuData} />} />
            <Route path={`/${MenuType.HalloweenVampire}/*`} element={<MenuHalloweenVampire />} />
            <Route
                path={`/${MenuType.SmugglingBlackMarketOwners}/*`}
                element={<MenuSmugglingOwners data={menuData} />}
            />
            <Route path={`/${MenuType.LaserGameCreate}/*`} element={<MenuLaserGameCreate />} />
            <Route path={`/${MenuType.LaserGameManage}/*`} element={<MenuLaserGameManage data={menuData} />} />
            <Route path={`/${MenuType.LaserGameAdmin}/*`} element={<MenuLaserGameAdmin data={menuData} />} />
            <Route path={`/${MenuType.Traveling}/*`} element={<MenuTraveling />} />
            <Route path={`/${MenuType.CasinoSubscription}/*`} element={<MenuCasinoSubscription data={menuData} />} />
            <Route path={`/${MenuType.CasinoSlotMachine}/*`} element={<MenuSlotMachine data={menuData} />} />
            <Route path={`/${MenuType.CasinoPoker}/*`} element={<MenuPoker data={menuData} />} />
            <Route path={`/${MenuType.CasinoBlackjack}/*`} element={<MenuBlackjack data={menuData} />} />
            <Route path={`/${MenuType.CasinoRoulette}/*`} element={<MenuRoulette data={menuData} />} />
            <Route path={`/${MenuType.CasinoInsideTrack}/*`} element={<MenuInsideTrack />} />
            <Route path={`/${MenuType.CasinoLuckyWheel}/*`} element={<MenuLuckyWheel />} />
            <Route path={`/${MenuType.WhatIfHammer}/*`} element={<MenuWhatIfHammer data={menuData} />} />
            <Route path={`/${MenuType.CyberAlertInjector}/*`} element={<BusinessCyberMenuAlertInjector />} />
        </Routes>
    );
};
