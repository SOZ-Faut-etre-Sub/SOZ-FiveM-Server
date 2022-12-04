import { SozInventoryModel } from './inventory';

export type NuiEventPlayerInventory = {
    action: 'openPlayerInventory';
    playerMoney: number;
    playerInventory: SozInventoryModel
}
