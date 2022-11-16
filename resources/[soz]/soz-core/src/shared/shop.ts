import { TargetOptions } from '../client/target/target.factory';
import { InventoryItemMetadata, Item, ItemType } from './item';
import { JobType } from './job';
import { Zone } from './polyzone/box.zone';

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
    zone: Zone;
    targets: TargetOptions[];
    products: ShopProduct[];
};

export type BossShopMenu = {
    job: JobType;
    products: ShopProduct[];
};
