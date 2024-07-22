import { TaxType } from '@public/shared/bank';
import {
    InventoryCard,
    InventoryConfiguration,
    InventoryItem,
    InventoryKey,
    InventoryType,
} from '@public/shared/inventory';
import { RpcServerEvent } from '@public/shared/rpc';
import { ShopItem } from '@public/shared/shop/superette';

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
    OpenShop: {
        items: ShopItem[];
        banner: string;
        tax?: TaxType;
        type: 'money' | 'marked_money';
        serverEvent: RpcServerEvent;
        shopId: string | null;
    };
    CloseShop: never;
}
