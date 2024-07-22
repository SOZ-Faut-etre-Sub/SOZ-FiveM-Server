import { ShopBrand } from '@public/config/shops';
import { InventoryItem, InventoryItemMetadata } from '@public/shared/inventory';
import { Item } from '@public/shared/item';

import { PlayerLicenceType } from '../player';
import { ShopProduct } from '../shop';

export type ShopContent = ShopProduct[];

export type ShopItem = Item & {
    price: number;
    amount?: number;
    metadata?: Partial<InventoryItemMetadata>;
};

export type CartElement = InventoryItem & {
    price: number;
    weight: number;
    unique: boolean;
};

const SuperetteContent: ShopContent = [
    { id: 'sandwich', type: 'food', price: 3 },
    { id: 'water_bottle', type: 'drink', price: 1 },
    { id: 'gps', type: 'item', price: 18 },
    { id: 'compass', type: 'item', price: 13 },
    { id: 'binoculars', type: 'item', price: 7 },
    { id: 'protestsign', type: 'item', price: 180 },
    { id: 'phone', type: 'item', price: 450 },
    { id: 'umbrella', type: 'item', price: 900 },
    { id: 'diving_gear', type: 'item', price: 2340 },
    { id: 'zpad', type: 'item', price: 2160 },
    { id: 'instantazouille', type: 'food', price: 9 },
    { id: 'mini_zigmac', type: 'food', price: 9 },
    { id: 'zait_fruite', type: 'drink', price: 9 },
    { id: 'zanta_glace_energetique', type: 'drink', price: 9 },
    { id: 'smartwatchuiwi', type: 'item', price: 150 },
];

const AmmunationContent: ShopContent = [
    { id: 'parachute', type: 'item', price: 225 },
    { id: 'weapon_bat', type: 'weapon', price: 162 },
    { id: 'weapon_golfclub', type: 'weapon', price: 405 },
    { id: 'weapon_knuckle', type: 'weapon', price: 90 },
    { id: 'weapon_poolcue', type: 'weapon', price: 180 },
    { id: 'weapon_stungun', type: 'weapon', requiredLicense: PlayerLicenceType.Weapon, price: 2250 },
    { id: 'weapon_pistol', type: 'weapon', requiredLicense: PlayerLicenceType.Weapon, price: 6750 },
    { id: 'ammo_01', type: 'weapon', requiredLicense: PlayerLicenceType.Weapon, price: 450 },
    { id: 'weapon_crowbar', type: 'weapon', price: 225 },
];

const ZkeaContent: ShopContent = [{ id: 'house_map', type: 'item', price: 13 }];

export const ShopsContent: Partial<Record<ShopBrand, ShopContent>> = {
    [ShopBrand.LtdGasolineNorth]: SuperetteContent,
    [ShopBrand.LtdGasolineSouth]: SuperetteContent,
    [ShopBrand.RobsliquorNorth]: SuperetteContent,
    [ShopBrand.RobsliquorSouth]: SuperetteContent,
    [ShopBrand.Supermarket247North]: SuperetteContent,
    [ShopBrand.Supermarket247South]: SuperetteContent,
    [ShopBrand.Supermarket247Cayo]: SuperetteContent,
    [ShopBrand.Zkea]: ZkeaContent,
    [ShopBrand.Ammunation]: AmmunationContent,
};
