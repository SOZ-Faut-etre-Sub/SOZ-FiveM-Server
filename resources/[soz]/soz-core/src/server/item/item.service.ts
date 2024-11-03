import { Inject, Injectable } from '@public/core/decorators/injectable';
import { VampireGameStateProvider } from '@public/server/story/vampire.game.state.provider';
import { ClientEvent } from '@public/shared/event/client';

import { InventoryItem, Item, ItemType } from '../../shared/item';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';

const BypassExpirationCheckType: ItemType[] = ['food', 'drink', 'cocktail', 'liquor'];

@Injectable()
export class ItemService {
    @Inject(QBCore)
    private qbcore: QBCore;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VampireGameStateProvider)
    private vampireGameStateProvider: VampireGameStateProvider;

    private showCallbacks = new Map<string, (source: number, target: number, item: InventoryItem) => void>();

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
        callback: (player: number, item: T, inventoryItem: InventoryItem) => void
    ) {
        this.qbcore.createUseableItem(itemId, (player: number, item: InventoryItem) => {
            const itemDef = this.getItem<T>(itemId);
            if (!BypassExpirationCheckType.includes(itemDef.type) && this.isItemExpired(item)) {
                this.notifier.notify(player, `${itemDef.label} est périmé(e).`, 'error');

                return;
            }
            if (this.vampireGameStateProvider.isGameStarted()) {
                return;
            }

            return callback(player, itemDef, item);
        });
    }

    public setItemShowCallback(
        itemId: string,
        callback: (player: number, target: number, inventoryItem: InventoryItem) => void
    ) {
        this.showCallbacks.set(itemId, callback);
    }

    public executeShowCallback(source: number, target: number, invItem: InventoryItem) {
        const cb = this.showCallbacks.get(invItem.name);
        if (cb) {
            TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);
            TriggerClientEvent(ClientEvent.ANIMATION_GIVE, target);
            cb(source, target, invItem);
        }
    }
}
