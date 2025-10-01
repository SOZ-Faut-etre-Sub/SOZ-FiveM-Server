import { ShopBrand } from '@public/config/shops';
import { ClothingShop, ClothingShopCategory } from '@public/shared/shop';

export interface NuiClothShopMethodMap {
    SetCatalog: ShopCatalog;
}

export type ShopCatalog = {
    brand: ShopBrand;
    shop_content: ClothingShop;
    shop_categories: Record<number, ClothingShopCategory>;
    under_types: Record<number, number[]>;
    isInCayo: boolean;
};
