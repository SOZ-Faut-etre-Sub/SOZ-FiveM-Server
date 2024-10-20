import {
    InventoryCard,
    InventoryConfiguration,
    InventoryItem,
    InventoryKey,
    InventoryType,
} from '@public/shared/inventory';
import { ShopContent } from '@public/shared/shop';

export interface NuiInventoryMethodMap {
    SetOpen: boolean;
    OpenInventory: {
        id: string;
        configuration: InventoryConfiguration;
        items: Record<number, InventoryItem>;
        type: InventoryType;
    };
    UpdateInventory: {
        id: string;
        configuration: InventoryConfiguration;
        items: Record<number, InventoryItem>;
    };
    CloseInventory: never;
    OpenKeychain: {
        keys: InventoryKey[];
    };
    CloseKeychain: never;
    OpenWallet: {
        cards: InventoryCard[];
    };
    CloseWallet: never;
    OpenShop: ShopContent;
    CloseShop: never;
}
