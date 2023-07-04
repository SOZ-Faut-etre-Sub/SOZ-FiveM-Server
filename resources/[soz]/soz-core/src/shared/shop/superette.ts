import { ShopBrand } from '@public/config/shops';

import { InventoryItem, Item } from '../item';
import { PlayerLicenceType } from '../player';
import { ShopProduct } from '../shop';

export type ShopContent = ShopProduct[];

export type SuperetteItem = Item & {
    price?: number;
    amount?: number;
    slot?: number;
};

export type CartElement = InventoryItem & {
    price: number;
};

const SuperetteContent: ShopContent = [
    { id: 'sandwich', type: 'food', price: 4 },
    { id: 'water_bottle', type: 'drink', price: 2 },
    { id: 'gps', type: 'item', price: 20 },
    { id: 'compass', type: 'item', price: 15 },
    { id: 'binoculars', type: 'item', price: 8 },
    { id: 'protestsign', type: 'item', price: 200 },
    { id: 'phone', type: 'item', price: 499 },
    { id: 'umbrella', type: 'item', price: 1000 },
    { id: 'diving_gear', type: 'item', price: 2600 },
    { id: 'zpad', type: 'item', price: 2400 },
    { id: 'instantazouille', type: 'food', price: 10 },
    { id: 'mini_zigmac', type: 'food', price: 10 },
    { id: 'zait_fruite', type: 'drink', price: 10 },
    { id: 'zanta_glace_energetique', type: 'drink', price: 10 },
];

const AmmunationContent: ShopContent = [
    { id: 'parachute', type: 'item', price: 250 },
    { id: 'weapon_bat', type: 'weapon', price: 180 },
    { id: 'weapon_golfclub', type: 'weapon', price: 450 },
    { id: 'weapon_knuckle', type: 'weapon', price: 100 },
    { id: 'weapon_poolcue', type: 'weapon', price: 200 },
    { id: 'weapon_stungun', type: 'weapon', requiredLicense: PlayerLicenceType.Weapon, price: 2500 },
    { id: 'weapon_pistol', type: 'weapon', requiredLicense: PlayerLicenceType.Weapon, price: 7500 },
    { id: 'ammo_01', type: 'weapon', requiredLicense: PlayerLicenceType.Weapon, price: 500 },
    { id: 'weapon_crowbar', type: 'weapon', price: 250 },
];

const ZkeaContent: ShopContent = [{ id: 'house_map', type: 'item', price: 15 }];

export const ShopsContent: Partial<Record<ShopBrand, ShopContent>> = {
    [ShopBrand.LtdGasolineNorth]: SuperetteContent,
    [ShopBrand.LtdGasolineSouth]: SuperetteContent,
    [ShopBrand.RobsliquorNorth]: SuperetteContent,
    [ShopBrand.RobsliquorSouth]: SuperetteContent,
    [ShopBrand.Supermarket247North]: SuperetteContent,
    [ShopBrand.Supermarket247South]: SuperetteContent,
    [ShopBrand.Zkea]: ZkeaContent,
    [ShopBrand.Ammunation]: AmmunationContent,
};
