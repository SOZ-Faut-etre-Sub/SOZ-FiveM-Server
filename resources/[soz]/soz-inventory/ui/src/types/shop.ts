import { InventoryItemMetadata, ItemType } from "./inventory";

/*
 * Get from gta-server/resources/[soz]/soz-core/src/shared/item.ts
 * Can be removed after soz-inventory moves to soz-core
 */
export type ShopItem = {
    name: string;
    label: string;
    description: string;
    weight: number;
    slot: number;
    useable: boolean;
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
    shouldClose?: boolean;
    illustrator?: Record<string, string> | string;
    disabled?: boolean; // added by inventory on the fly
    shortcut?: string | null; // added by inventory on the fly
    price: number,
};