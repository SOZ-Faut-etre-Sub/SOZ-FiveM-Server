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
    { id: 'umbrella_white', type: 'item', price: 900 },
    { id: 'umbrella_black', type: 'item', price: 900 },
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

const SouvenirOtherContent: ShopContent = [
    { id: 'red_rose', type: 'item', price: 300 },
    { id: 'chocolate_box', type: 'food', price: 500 },
    { id: 'prestige_pen', type: 'item', price: 3200 },
    { id: 'joker_card', type: 'item', price: 10 },
    { id: 'rubber_duck', type: 'item', price: 250 },
    { id: 'flower_bouquet', type: 'item', price: 300 },
    { id: 'chair_trophy', type: 'item', price: 100 },
    { id: 'tibet_bowl', type: 'item', price: 200 },
    { id: 'cake_box', type: 'food', price: 50 },
    { id: 'sugar', type: 'food', price: 50 },
    { id: 'knitting_kit', type: 'item', price: 399 },
    { id: 'squishy', type: 'item', price: 50 },
    { id: 'zamagotchi', type: 'item', price: 200 },
    { id: 'bandage_uwu', type: 'item', price: 20 },
    { id: 'lucky_token', type: 'item', price: 13 },
    { id: 'ghost_kit', type: 'item', price: 5000 },
    { id: 'zpschitt', type: 'item', price: 100 },
    { id: 'pacemaker', type: 'item', price: 5000 },
    { id: 'luxe_tarot', type: 'item', price: 999 },
    { id: 'lezgo_box', type: 'item', price: 2000 },
    { id: 'tarot_card', type: 'item', price: 50 },
    { id: 'drawing', type: 'item', price: 10 },
    { id: 'jdr_soz', type: 'item', price: 100 },
    { id: 'licence_gift', type: 'item', price: 600 },
    { id: 'wrapping_blue', type: 'item', price: 100 },
    { id: 'wrapping_gold', type: 'item', price: 100 },
    { id: 'wrapping_green', type: 'item', price: 100 },
    { id: 'wrapping_red', type: 'item', price: 100 },
];

const SouvenirPlushContent: ShopContent = [
    { id: 'puma_plush', type: 'item', price: 200 },
    { id: 'fish_plush', type: 'item', price: 1000 },
    { id: 'wolf_plush', type: 'item', price: 250 },
    { id: 'bear_plush', type: 'item', price: 250 },
    { id: 'koala_plush', type: 'item', price: 200 },
    { id: 'sozy_plush', type: 'item', price: 700 },
    { id: 'crow_plush', type: 'item', price: 399 },
    { id: 'pumpkin_plush', type: 'item', price: 50 },
    { id: 'teddo_plush', type: 'item', price: 505 },
    { id: 'goat_plush', type: 'item', price: 666 },
    { id: 'beaver_figurine', type: 'item', price: 1500 },
    { id: 'cabbage_plush', type: 'item', price: 50 },
    { id: 'cow_plush', type: 'item', price: 150 },
    { id: 'wrapping_blue', type: 'item', price: 100 },
    { id: 'wrapping_gold', type: 'item', price: 100 },
    { id: 'wrapping_green', type: 'item', price: 100 },
    { id: 'wrapping_red', type: 'item', price: 100 },
];

const SouvenirMemoryContent: ShopContent = [
    { id: 'snow_globe_zerawood', type: 'item', price: 300 },
    { id: 'maneki_neko', type: 'item', price: 1000 },
    { id: 'friendship_bracelet', type: 'item', price: 300 },
    { id: 'intimate_notebook', type: 'item', price: 950 },
    { id: 'meteorite_piece', type: 'item', price: 25000 },
    { id: 'snow_globe_bc', type: 'item', price: 300 },
    { id: 'ak_keychain', type: 'item', price: 470 },
    { id: 'zebra_keychain', type: 'item', price: 250 },
    { id: 'eternal_rose', type: 'item', price: 3500 },
    { id: 'green_card', type: 'item', price: 45 },
    { id: 'yosemite_keychain', type: 'item', price: 250 },
    { id: 'ls_perfume', type: 'item', price: 50 },
    { id: 'meteorite_display', type: 'item', price: 10000 },
    { id: 'snow_globe_farm', type: 'item', price: 200 },
    { id: 'love_keychain', type: 'item', price: 696 },
    { id: 'souvenir_shirt', type: 'item', price: 200 },
    { id: 'souvenir_mug', type: 'item', price: 200 },
    { id: 'douce_figurine', type: 'item', price: 1000000 },
    { id: 'souvenir_vb', type: 'item', price: 275 },
    { id: 'soap_box', type: 'item', price: 300 },
    { id: 'souvenir_coin', type: 'item', price: 5 },
    { id: 'postcard', type: 'item', price: 18 },
    { id: 'snow_globe_mp', type: 'item', price: 450 },
    { id: 'travel_cushion', type: 'item', price: 1000 },
    { id: 'wrapping_blue', type: 'item', price: 100 },
    { id: 'wrapping_gold', type: 'item', price: 100 },
    { id: 'wrapping_green', type: 'item', price: 100 },
    { id: 'wrapping_red', type: 'item', price: 100 },
];

const SouvenirJewelContent: ShopContent = [
    { id: 'engagement_ring', type: 'item', price: 10000 },
    { id: 'first_half_keyring', type: 'item', price: 2500 },
    { id: 'second_half_keyring', type: 'item', price: 2500 },
    { id: 'zolex', type: 'item', price: 50000 },
    { id: 'eternal_ring', type: 'item', price: 100000 },
    { id: 'pocket_watch', type: 'item', price: 7500 },
    { id: 'norigae', type: 'item', price: 700 },
    { id: 'gold_turtle', type: 'item', price: 1050 },
    { id: 'champion_ring', type: 'item', price: 50000 },
    { id: 'wrapping_blue', type: 'item', price: 100 },
    { id: 'wrapping_gold', type: 'item', price: 100 },
    { id: 'wrapping_green', type: 'item', price: 100 },
    { id: 'wrapping_red', type: 'item', price: 100 },
];

export const ShopsContent: Partial<Record<ShopBrand, ShopContent>> = {
    [ShopBrand.LtdGasolineNorth]: SuperetteContent,
    [ShopBrand.LtdGasolineSouth]: SuperetteContent,
    [ShopBrand.RobsliquorNorth]: SuperetteContent,
    [ShopBrand.RobsliquorSouth]: SuperetteContent,
    [ShopBrand.Supermarket247North]: SuperetteContent,
    [ShopBrand.Supermarket247South]: SuperetteContent,
    [ShopBrand.Supermarket247Cayo]: SuperetteContent,
    [ShopBrand.Zkea]: ZkeaContent,
    [ShopBrand.SouvenirOther]: SouvenirOtherContent,
    [ShopBrand.SouvenirPlush]: SouvenirPlushContent,
    [ShopBrand.SouvenirMemory]: SouvenirMemoryContent,
    [ShopBrand.SouvenirJewel]: SouvenirJewelContent,
    [ShopBrand.Ammunation]: AmmunationContent,
};
