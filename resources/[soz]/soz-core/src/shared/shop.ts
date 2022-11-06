import { TargetOptions, ZoneOptions } from '../client/target/target.factory';
import { InventoryItemMetadata, Item, ItemType } from './item';

export enum ClothingBrand {
    PONSONBYS = 'ponsonbys',
    SUBURBAN = 'suburban',
    BINCO = 'binco',
}

export type ShopProduct = {
    id: string;
    type: ItemType;
    item?: Item;
    metadata?: InventoryItemMetadata;
    price: number;
};

export type ShopConfig = {
    name: string;
    zone: ZoneOptions;
    targets: TargetOptions[];
    products: ShopProduct[];
};
