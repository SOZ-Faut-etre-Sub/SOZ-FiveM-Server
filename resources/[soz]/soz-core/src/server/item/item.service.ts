import { Inject, Injectable } from '../../core/decorators/injectable';
import { InventoryItem, Item, ItemType } from '../../shared/item';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { QBCore } from '../qbcore';

@Injectable()
export class ItemService {
    @Inject(QBCore)
    private qbcore: QBCore;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    public getItems<T extends Item = Item>(type?: ItemType): Record<string, T> {
        return this.qbcore.getItems(type);
    }

    public getItem<T extends Item = Item>(id: string): T | null {
        return this.qbcore.getItem<T>(id);
    }

    public isItemExpired(item: InventoryItem): boolean {
        if (item.metadata && item.metadata.expiration) {
            return new Date().getTime() > new Date(item.metadata.expiration).getTime();
        }

        return false;
    }

    public setItemUseCallback<T extends Item = Item>(
        itemId: string,
        callback: (player: number, item: T, inventoryItem: InventoryItem) => void,
        allowWeaponUsage = true
    ) {
        this.qbcore.createUseableItem(itemId, (player: number, item: any) => {
            if (!allowWeaponUsage && this.playerService.getPlayerWeapon(player) !== null) {
                this.notifier.notify(player, 'Votre main est déjà occupée à porter une arme.', 'error');

                return false;
            }

            return callback(player, this.qbcore.getItem<T>(itemId), item as InventoryItem);
        });
    }
}
