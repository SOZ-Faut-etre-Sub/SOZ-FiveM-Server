import { SozInventoryModel } from './inventory';

export type NuiEventPlayerInventory = {
    action: string;
    playerMoney?: number;
    playerInventory?: SozInventoryModel
    targetInventory?: SozInventoryModel
    keys?: any;
}
