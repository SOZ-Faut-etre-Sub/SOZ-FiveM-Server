import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';
import { InventoryManager } from './inventory.manager';

@Provider()
export class InventoryUsageProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.INVENTORY_SET_ITEM_SHORTCUT)
    setItemUsage(source: number, shortcut: number, slot: number) {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            return;
        }

        const item = this.inventoryManager.getSlot(source, slot);
        if (!item) {
            return;
        }

        player.PlayerData.metadata.shortcuts[shortcut] = {
            name: item.name,
            metadata: {
                serial: item.metadata.serial,
            },
        };

        player.Functions.SetMetaData('shortcuts', player.PlayerData.metadata.shortcuts);
        this.notifier.notify(source, `Vous avez changé l'objet lié au raccourcis ~b~#${shortcut}`, 'info');
    }

    @Rpc(RpcEvent.INVENTORY_GET_ITEM_BY_SHORTCUT)
    getItemByShortcut(source: number, shortcut: number): InventoryItem | null {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            return;
        }

        const shortcutItem = player.PlayerData.metadata.shortcuts[shortcut];
        if (!shortcutItem) {
            return;
        }

        const item = this.inventoryManager.findItem(source, item => {
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
