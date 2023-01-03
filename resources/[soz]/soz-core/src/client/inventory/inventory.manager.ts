import { Inject, Injectable } from '../../core/decorators/injectable';
import { ItemService } from '../../server/item/item.service';
import { InventoryItem } from '../../shared/item';
import { PlayerService } from '../player/player.service';

@Injectable()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    public getItems(): InventoryItem[] {
        const items = this.playerService.getPlayer().items;

        if (Array.isArray(items)) {
            return items;
        } else {
            return Object.keys(items).map(key => items[key]);
        }
    }

    public hasEnoughItem(itemId: string, amount?: number, skipExpiredItem?: boolean): boolean {
        const items = this.playerService.getPlayer().items;
        let count = 0;

        if (Array.isArray(items)) {
            for (const item of items) {
                if (item.name === itemId) {
                    if (!amount) {
                        return true;
                    }

                    if (skipExpiredItem && this.itemService.isItemExpired(item)) {
                        continue;
                    }

                    count += item.amount;
                }
            }
        } else {
            for (const slot of Object.keys(items)) {
                const item = items[slot];

                if (item.name === itemId) {
                    if (!amount) {
                        return true;
                    }

                    if (skipExpiredItem && this.itemService.isItemExpired(item)) {
                        continue;
                    }

                    count += item.amount;
                }
            }
        }

        if (amount) {
            return count >= amount;
        }
        return false;
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
}
