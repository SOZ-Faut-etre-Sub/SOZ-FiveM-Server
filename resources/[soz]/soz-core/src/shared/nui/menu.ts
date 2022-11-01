import { AdminMenuStateProps } from '../../nui/components/Admin/AdminMenu';
import { WardrobeMenuData } from '../cloth';
import { FuelStation, FuelType } from '../fuel';
import { GarageMenuData } from '../vehicle/garage';
import {
    VehicleAuctionMenuData,
    VehicleCustomMenuData,
    VehicleDealershipMenuData,
    VehicleMenuData,
} from '../vehicle/vehicle';

export interface NuiMenuMethodMap {
    ArrowDown: never;
    ArrowLeft: never;
    ArrowRight: never;
    ArrowUp: never;
    Backspace: never;
    CloseMenu: never;
    Enter: never;
    SetMenuType: SetMenuType;
}

export type SetMenuType = {
    menuType: MenuType;
    data: any;
    subMenuId?: string;
};

export enum MenuType {
    AdminMenu = 'AdminMenu',
    BahamaUnicornJobMenu = 'baun_job',
    BennysOrderMenu = 'bennys_order',
    Demo = 'demo',
    BossShop = 'boss_shop',
    MaskShop = 'mask_shop',
    FightForStyleJobMenu = 'ffs_job',
    FoodJobMenu = 'food_job_menu',
    Garage = 'garage_menu',
    OilSetStationPrice = 'oil_set_station_price',
    SetHealthState = 'set_health_state',
    StonkJobMenu = 'stonk_job',
    Vehicle = 'vehicle',
    VehicleAuction = 'vehicle_auction',
    VehicleCustom = 'vehicle_custom',
    VehicleDealership = 'vehicle_dealership',
    Wardrobe = 'wardrobe',
}

export interface MenuTypeMap extends Record<MenuType, any> {
    [MenuType.AdminMenu]: AdminMenuStateProps['data'];
    [MenuType.BahamaUnicornJobMenu]: any;
    [MenuType.Demo]: never;
    [MenuType.FightForStyleJobMenu]: any;
    [MenuType.Garage]: GarageMenuData;
    [MenuType.OilSetStationPrice]: Record<FuelType, number>;
    [MenuType.SetHealthState]: number;
    [MenuType.Vehicle]: VehicleMenuData;
    [MenuType.VehicleAuction]: VehicleAuctionMenuData;
    [MenuType.VehicleCustom]: VehicleCustomMenuData;
    [MenuType.VehicleDealership]: VehicleDealershipMenuData;
    [MenuType.Wardrobe]: WardrobeMenuData;
}
