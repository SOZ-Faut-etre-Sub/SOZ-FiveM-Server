import { Inject, Injectable } from '@core/decorators/injectable';
import { ItemService } from '@public/client/item/item.service';
import { TaxRepository } from '@public/client/repository/tax.repository';
import { TaxType } from '@public/shared/bank';

import { InventoryItem } from '../../shared/item';
import { PlayerService } from '../player/player.service';

@Injectable()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(TaxRepository)
    private taxRepository: TaxRepository;

    public getItems(): InventoryItem[] {
        const items = this.playerService.getPlayer().items;

        if (Array.isArray(items)) {
            return items;
        } else {
            return Object.keys(items).map(key => items[key]);
        }
    }

    public hasEnoughItem(itemId: string, amount?: number, skipExpiredItem?: boolean): boolean {
        if (amount === 0) {
            return true;
        }
        if (!amount) {
            amount = 1;
        }
        return this.getItemCount(itemId, skipExpiredItem) >= amount;
    }

    public getItemCount(itemId: string, skipExpiredItem?: boolean): number {
        const items = this.playerService.getPlayer().items;
        let count = 0;

        if (Array.isArray(items)) {
            for (const item of items) {
                if (item.name === itemId) {
                    if (skipExpiredItem && this.itemService.isExpired(item)) {
                        continue;
                    }

                    count += item.amount;
                }
            }
        } else {
            for (const slot of Object.keys(items)) {
                const item = items[slot];

                if (item.name === itemId) {
                    if (skipExpiredItem && this.itemService.isExpired(item)) {
                        continue;
                    }

                    count += item.amount;
                }
            }
        }

        return count;
    }

    public findItem(predicate: (item: InventoryItem) => boolean): InventoryItem | null {
        const items = this.playerService.getPlayer().items;

        if (Array.isArray(items)) {
            return items.find(predicate) || null;
        } else {
            return (
                Object.keys(items)
                    .map(key => items[key])
                    .find(predicate) || null
            );
        }
    }

    public openShopInventory(
        shopContent,
        shopHeaderTexture: string,
        taxType?: TaxType,
        type: 'money' | 'marked_money' = 'money'
    ) {
        const taxValue = taxType ? this.taxRepository.getTaxValue(taxType) : 0;
        TriggerEvent('inventory:client:openShop', shopContent, shopHeaderTexture, type, taxValue / 100, taxType);
    }

    public openInventory(inventoryType: string, inventoryIdentifier: string, context?: any) {
        TriggerServerEvent('inventory:server:openInventory', inventoryType, inventoryIdentifier, context);
    }
}
