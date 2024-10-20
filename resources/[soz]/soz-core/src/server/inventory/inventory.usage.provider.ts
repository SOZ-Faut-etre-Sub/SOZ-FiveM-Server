import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/inventory';
import { RpcServerEvent } from '../../shared/rpc';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';
import { InventoryFactory } from './inventory.factory';

@Provider()
export class InventoryUsageProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.INVENTORY_SET_ITEM_SHORTCUT)
    async setItemShortcut(source: number, shortcut: number, slot: number) {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const item = inventory.getItemAtSlot(slot);
        const itemObject = this.itemService.getItem(item.name);

        if (!item || !itemObject) {
            return;
        }

        if (shortcut < 0 || shortcut > 9) {
            return;
        }

        if (itemObject.type !== 'weapon' && !itemObject.useable) {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cet objet à un raccourci.');

            return;
        }

        if (shortcut !== 0 && shortcut <= 2 && item.type !== 'weapon') {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cet objet à ce raccourci.');

            return;
        }

        if ((shortcut === 0 || shortcut > 2) && item.type === 'weapon') {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cette arme à ce raccourci.');

            return;
        }

        Object.entries(player.PlayerData.metadata.shortcuts).forEach(([key, value]) => {
            if (value.name === item.name && value.metadata.serial === item.metadata.serial) {
                player.PlayerData.metadata.shortcuts[key] = null;
            }
            if (parseInt(key) < 0 || parseInt(key) > 9) {
                player.PlayerData.metadata.shortcuts[key] = null;
            }
        });

        if (shortcut !== null) {
            player.PlayerData.metadata.shortcuts[shortcut] = {
                name: item.name,
                metadata: {
                    serial: item.metadata.serial,
                },
            };
        }

        player.Functions.SetMetaData('shortcuts', { ...player.PlayerData.metadata.shortcuts });
    }

    @OnEvent(ServerEvent.INVENTORY_REMOVE_ITEM_SHORTCUT)
    async removeItemShortcut(source: number, shortcut: number) {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            return;
        }

        if (shortcut < 0 || shortcut > 9) {
            return;
        }

        player.PlayerData.metadata.shortcuts[shortcut] = null;
        player.Functions.SetMetaData('shortcuts', { ...player.PlayerData.metadata.shortcuts });
    }

    @OnEvent(ServerEvent.INVENTORY_MOVE_ITEM_SHORTCUT)
    async moveItemShortcut(source: number, previousShortcut: number, nextShortcut: number) {
        const player = this.QBCore.getPlayer(source);

        if (!player) {
            return;
        }

        if (previousShortcut < 0 || previousShortcut > 9 || nextShortcut < 0 || nextShortcut > 9) {
            return;
        }

        const existingNextShortcut = player.PlayerData.metadata.shortcuts[nextShortcut];
        const existingPreviousShortcut = player.PlayerData.metadata.shortcuts[previousShortcut];
        const itemNext = existingNextShortcut ? this.itemService.getItem(existingNextShortcut.name) : null;
        const itemPrevious = this.itemService.getItem(existingPreviousShortcut.name);

        if (!itemPrevious || (existingNextShortcut && !itemNext)) {
            return;
        }

        if (existingNextShortcut && itemNext.type === 'weapon' && (previousShortcut === 0 || previousShortcut > 2)) {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cette arme à ce raccourci.');

            return;
        }

        if (existingNextShortcut && itemNext.type !== 'weapon' && previousShortcut !== 0 && previousShortcut <= 2) {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cet objet à ce raccourci.');

            return;
        }

        if (itemPrevious.type === 'weapon' && (nextShortcut === 0 || nextShortcut > 2)) {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cette arme à ce raccourci.');

            return;
        }

        if (itemPrevious.type !== 'weapon' && nextShortcut !== 0 && nextShortcut <= 2) {
            this.notifier.error(source, 'Vous ne pouvez pas assigner cet objet à ce raccourci.');

            return;
        }

        player.PlayerData.metadata.shortcuts[previousShortcut] = existingNextShortcut;
        player.PlayerData.metadata.shortcuts[nextShortcut] = existingPreviousShortcut;

        player.Functions.SetMetaData('shortcuts', { ...player.PlayerData.metadata.shortcuts });
    }

    @Rpc(RpcServerEvent.INVENTORY_GET_ITEM_BY_SHORTCUT)
    async getItemByShortcut(source: number, shortcut: number): Promise<InventoryItem | null> {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            return;
        }

        const shortcutItem = player.PlayerData.metadata.shortcuts[shortcut];
        if (!shortcutItem) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        const item = inventory.findItem(item => {
            if (shortcutItem.metadata.serial) {
                return item.name === shortcutItem.name && item.metadata.serial === shortcutItem.metadata.serial;
            }
            return item.name === shortcutItem.name;
        });
        if (!item) {
            return;
        }

        return item;
    }
}
