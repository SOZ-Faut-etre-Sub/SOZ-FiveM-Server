import { SozInventoryModel } from './inventory';

export type NuiEventPlayerInventory = {
    action: string;
    playerMoney?: number;
    playerInventory?: SozInventoryModel
    targetInventory?: SozInventoryModel
    playerShortcuts?: any
    keys?: any;
}
