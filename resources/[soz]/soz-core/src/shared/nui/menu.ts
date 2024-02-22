import { ApartmentMenuData } from '@public/shared/housing/housing';
import { JobType } from '@public/shared/job';
import { NuiJobEmployeeOnDuty, PromoteMenuData } from '@public/shared/nui/job';
import { PlayerPersonalMenuData } from '@public/shared/nui/player';

import { AdminMenuStateProps } from '../../nui/components/Admin/AdminMenu';
import { PlayerCloakroomItem, WardrobeMenuData } from '../cloth';
import { DrivingSchoolMenuData } from '../driving-school';
import { FuelType } from '../fuel';
import { AdminMapperMenuData, HousingUpgradesMenuData } from '../housing/menu';
import { DmcJobMenuData } from '../job/dmc';
import {
    PoliceJobFineMenuData,
    PoliceJobLicencesMenuData,
    PoliceJobMenuData,
    PoliceJobMoneycheckerMenuData,
} from '../job/police';
import { MenuUpwData, UpwOrderMenuData } from '../job/upw';
import { Race } from '../race';
import { BossShopMenu, ShopProduct } from '../shop';
import { GarageMenuData } from '../vehicle/garage';
import { VehicleCustomMenuData } from '../vehicle/modification';
import { VehicleAuctionMenuData, VehicleDealershipMenuData, VehicleMenuData } from '../vehicle/vehicle';
import { WeaponsMenuData } from '../weapons/weapon';
import { PropPlacementMenuData } from './prop_placement';

export interface NuiMenuMethodMap {
    ArrowDown: never;
    ArrowLeft: never;
    ArrowRight: never;
    ArrowUp: never;
    Backspace: never;
    CloseMenu: boolean;
    ResetMenu: never;
    Enter: never;
    SetMenuType: SetMenuType;
    ToggleFocus: never;
    SetMenuVisibility: boolean;
}

export type SetMenuType = {
    menuType: MenuType;
    data: any;
    useMouse?: boolean;
    subMenuId?: string;
};

export enum MenuType {
    AdminMenu = 'AdminMenu',
    AdminMapperMenu = 'AdminMapperMenu',
    BahamaUnicornJobMenu = 'baun_job',
    BennysOrderMenu = 'bennys_order',
    BennysUpgradeVehicle = 'bennys_upgrade_vehicle',
    Demo = 'demo',
    DrivingSchool = 'driving_school',
    BossShop = 'boss_shop',
    ClothShop = 'cloth_shop',
    SuperetteShop = 'superette_shop',
    TattooShop = 'tattoo_shop',
    JewelryShop = 'jewelry_shop',
    BarberShop = 'barber_shop',
    FightForStyleJobMenu = 'ffs_job',
    FightForStyleShowRoomMenu = 'ffs_show_room',
    FoodJobMenu = 'food_job_menu',
    HousingUpgrades = 'housing_upgrades',
    Garage = 'garage_menu',
    JobBennys = 'job_bennys',
    JobUpw = 'job_upw',
    JobNews = 'job_news',
    UpwOrderMenu = 'upw_order',
    OilSetStationPrice = 'oil_set_station_price',
    SetHealthState = 'set_health_state',
    StonkJobMenu = 'stonk_job',
    Vehicle = 'vehicle',
    VehicleAuction = 'vehicle_auction',
    VehicleCustom = 'vehicle_custom',
    VehicleDealership = 'vehicle_dealership',
    Wardrobe = 'wardrobe',
    GarbageJobMenu = 'garbage_job_menu',
    GunSmith = 'gunsmith',
    LsmcPharmacy = 'lsmc_pharmacy',
    MandatoryJobMenu = 'mdr_job',
    IllegalShop = 'illegal_shop',
    EasterShop = 'easter_shop',
    TaxiJobMenu = 'taxi_job',
    PlayerPersonal = 'player_personal',
    PropPlacementMenu = 'prop_placement_menu',
    LsmcJobMenu = 'lsmc_job_menu',
    JobOnDutyMenu = 'job_on_duty',
    Album = 'album',
    DrugShop = 'drug_shop',
    DrugGarden = 'drug_garden',
    DrugAdmin = 'drug_admin',
    RentBoat = 'rent_boat',
    RaceAdmin = 'RaceAdmin',
    RaceRank = 'RaceRank',
    GouvJobMenu = 'gouv_job',
    FDFJobMenu = 'fdf_job',
    DmcJobMenu = 'dmc_job',
    PoliceJobMenu = 'police_job_menu',
    PoliceJobLicences = 'police_job_licences',
    PoliceJobMoneychecker = 'police_job_moneychecker',
    PoliceJobFines = 'police_job_fines',
    PitStopPriceMenu = 'pitstop_price',
    Promote = 'promote',
    HubEntryAdmin = 'hub_entry_admin',
    HousingBuyMenu = 'housing_buy_menu',
    HousingSellMenu = 'housing_sell_menu',
    HousingVisitMenu = 'housing_visit_menu',
    HousingBellMenu = 'housing_bell_menu',
    HousingEnterMenu = 'housing_enter_menu',
    HousingAddRoommateMenu = 'housing_add_roommate_menu',
    HousingRemoveRoommateMenu = 'housing_remove_roommate_menu',
    HousingCloakroomMenu = 'housing_cloakroom_menu',
}

export interface MenuTypeMap extends Record<MenuType, any> {
    [MenuType.AdminMenu]: AdminMenuStateProps['data'];
    [MenuType.AdminMapperMenu]: AdminMapperMenuData;
    [MenuType.BahamaUnicornJobMenu]: any;
    [MenuType.BennysUpgradeVehicle]: VehicleCustomMenuData;
    [MenuType.BennysOrderMenu]: any;
    [MenuType.BossShop]: BossShopMenu;
    [MenuType.Demo]: never;
    [MenuType.DrivingSchool]: DrivingSchoolMenuData;
    [MenuType.FightForStyleJobMenu]: any;
    [MenuType.FightForStyleShowRoomMenu]: any;
    [MenuType.HousingUpgrades]: HousingUpgradesMenuData;
    [MenuType.Garage]: GarageMenuData;
    [MenuType.JobBennys]: {
        insideUpgradeZone: boolean;
    };
    [MenuType.JobUpw]: MenuUpwData;
    [MenuType.UpwOrderMenu]: UpwOrderMenuData;
    [MenuType.OilSetStationPrice]: Record<FuelType, number>;
    [MenuType.SetHealthState]: number;
    [MenuType.Vehicle]: VehicleMenuData;
    [MenuType.VehicleAuction]: VehicleAuctionMenuData;
    [MenuType.VehicleCustom]: VehicleCustomMenuData;
    [MenuType.VehicleDealership]: VehicleDealershipMenuData;
    [MenuType.Wardrobe]: WardrobeMenuData;
    [MenuType.GunSmith]: WeaponsMenuData;
    [MenuType.LsmcPharmacy]: any;
    [MenuType.MandatoryJobMenu]: any;
    [MenuType.IllegalShop]: Map<string, ShopProduct[]>;
    [MenuType.EasterShop]: ShopProduct[];
    [MenuType.TaxiJobMenu]: any;
    [MenuType.PlayerPersonal]: PlayerPersonalMenuData;
    [MenuType.LsmcJobMenu]: any;
    [MenuType.JobOnDutyMenu]: NuiJobEmployeeOnDuty;
    [MenuType.Album]: { tracks: Record<string, string>; volume: number };
    [MenuType.DrugShop]: ShopProduct[];
    [MenuType.DrugAdmin]: never;
    [MenuType.RentBoat]: any;
    [MenuType.RaceAdmin]: Race[];
    [MenuType.RaceRank]: { id: number; name: string };
    [MenuType.GouvJobMenu]: { onDuty: boolean };
    [MenuType.PropPlacementMenu]: PropPlacementMenuData;
    [MenuType.FDFJobMenu]: any;
    [MenuType.JobNews]: { job: JobType };
    [MenuType.DmcJobMenu]: DmcJobMenuData;
    [MenuType.PoliceJobLicences]: PoliceJobLicencesMenuData;
    [MenuType.PoliceJobMoneychecker]: PoliceJobMoneycheckerMenuData;
    [MenuType.PoliceJobFines]: PoliceJobFineMenuData;
    [MenuType.PoliceJobMenu]: PoliceJobMenuData;
    [MenuType.PitStopPriceMenu]: never;
    [MenuType.Promote]: PromoteMenuData;
    [MenuType.HousingAddRoommateMenu]: ApartmentMenuData;
    [MenuType.HousingBellMenu]: ApartmentMenuData;
    [MenuType.HousingBuyMenu]: ApartmentMenuData;
    [MenuType.HousingEnterMenu]: ApartmentMenuData;
    [MenuType.HousingRemoveRoommateMenu]: ApartmentMenuData;
    [MenuType.HousingSellMenu]: ApartmentMenuData;
    [MenuType.HousingVisitMenu]: ApartmentMenuData;
    [MenuType.HousingCloakroomMenu]: {
        items: PlayerCloakroomItem[];
    };
}
