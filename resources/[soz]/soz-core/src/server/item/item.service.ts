import { Inject, Injectable } from '@core/decorators/injectable';
import { Inventory } from '@public/server/inventory/inventory';
import { Notifier } from '@public/server/notifier';
import { VampireGameStateProvider } from '@public/server/story/vampire.game.state.provider';
import { ClientEvent } from '@public/shared/event/client';
import { getItemsWeight, InventoryItem, InventoryItemMetadata, isInventoryItemExpired } from '@public/shared/inventory';

import { Item, ItemType } from '../../shared/item';
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

    private items: Record<string, Item> = null;

    private showCallbacks = new Map<string, (source: number, target: number, item: InventoryItem) => void>();
    private usingItems = new Set<number>();

    private useCallbacks = new Map<
        string,
        (player: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) => Promise<void> | void
    >();

    public loadItems() {
        if (this.items) {
            return;
        }

        this.items = this.qbcore.getItems();
    }

    public getItems<T extends Readonly<Item> = Readonly<Item>>(type?: ItemType): Record<string, Readonly<T>> {
        if (!this.items) {
            this.loadItems();
        }

        if (type) {
            const values = {};

            for (const [key, value] of Object.entries(this.items)) {
                if (value.type === type) {
                    values[key] = value;
                }
            }

            return values as Record<string, Readonly<T>>;
        }

        return { ...this.items } as Record<string, Readonly<T>>;
    }

    public getItem<T extends Item = Item>(id: string): Readonly<T> | null {
        if (!this.items) {
            this.loadItems();
        }

        if (!this.items[id]) {
            return null;
        }

        return this.items[id] as Readonly<T>;
    }

    public getItemsWeight(items: { name: string; amount?: number; metadata?: InventoryItemMetadata | null }[]): number {
        return getItemsWeight(items, (id: string) => this.getItem(id));
    }

    public async useItem(source: number, item: InventoryItem, inventory: Inventory): Promise<boolean> {
        const cb = this.useCallbacks.get(item.name);

        if (cb) {
            if (this.usingItems.has(source)) {
                this.notifier.error(source, "Un objet est déjà en cours d'utilisation.");

                return false;
            }

            this.usingItems.add(source);
            await cb(source, this.getItem(item.name), item, inventory);
            this.usingItems.delete(source);
        }

        return true;
    }

    public setItemUseCallback<T extends Item = Item>(
        itemId: string,
        callback: (player: number, item: T, inventoryItem: InventoryItem, inventory: Inventory) => Promise<void> | void
    ) {
        this.useCallbacks.set(itemId, (player: number, item: T, inventoryItem: InventoryItem, inventory: Inventory) => {
            if (!BypassExpirationCheckType.includes(item.type) && isInventoryItemExpired(inventoryItem)) {
                this.notifier.notify(player, `${item.label} est périmé(e).`, 'error');

                return;
            }

            if (this.vampireGameStateProvider.isGameStarted()) {
                return;
            }

            return callback(player, item, inventoryItem, inventory);
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
