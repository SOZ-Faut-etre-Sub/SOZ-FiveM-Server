import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/inventory';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';
import { InventoryFactory } from './inventory.factory';

@Provider()
export class InventoryUsageProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.INVENTORY_SET_ITEM_SHORTCUT)
    async setItemUsage(source: number, shortcut: number, slot: number) {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const item = inventory.getItemAtSlot(slot);

        if (!item) {
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

        if (shortcut !== null) {
            this.notifier.notify(source, `Vous avez changé l'objet lié au raccourci ~b~#${shortcut}`, 'info');
        } else {
            this.notifier.notify(source, `Vous avez supprimé l'objet lié au raccourci`, 'info');
        }
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
