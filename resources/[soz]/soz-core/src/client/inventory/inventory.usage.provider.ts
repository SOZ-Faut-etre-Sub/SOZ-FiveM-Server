import { Command } from '../../core/decorators/command';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';

@Provider()
export class InventoryUsageProvider {
    private async useItem(shortcut: number) {
        const item = await emitRpc<InventoryItem | null>(RpcEvent.INVENTORY_GET_ITEM_BY_SHORTCUT, shortcut);
        if (!item) {
            return;
        }

        TriggerServerEvent(ServerEvent.INVENTORY_USE_ITEM, item.slot);
    }

    @Command('inventory.use.1', {
        description: "Raccourci d'arme principale",
        keys: [{ mapper: 'keyboard', key: '1' }],
    })
    async useItem1() {
        await this.useItem(1);
    }

    @Command('inventory.use.2', {
        description: "Raccourci d'arme secondaire",
        keys: [{ mapper: 'keyboard', key: '2' }],
    })
    async useItem2() {
        await this.useItem(2);
    }

    @Command('inventory.use.3', { description: "Raccourci d'inventaire 03", keys: [{ mapper: 'keyboard', key: '3' }] })
    async useItem3() {
        await this.useItem(3);
    }

    @Command('inventory.use.4', { description: "Raccourci d'inventaire 04", keys: [{ mapper: 'keyboard', key: '4' }] })
    async useItem4() {
        await this.useItem(4);
    }

    @Command('inventory.use.5', { description: "Raccourci d'inventaire 05", keys: [{ mapper: 'keyboard', key: '5' }] })
    async useItem5() {
        await this.useItem(5);
    }

    @Command('inventory.use.6', { description: "Raccourci d'inventaire 06", keys: [{ mapper: 'keyboard', key: '6' }] })
    async useItem6() {
        await this.useItem(6);
    }

    @Command('inventory.use.7', { description: "Raccourci d'inventaire 07", keys: [{ mapper: 'keyboard', key: '7' }] })
    async useItem7() {
        await this.useItem(7);
    }

    @Command('inventory.use.8', { description: "Raccourci d'inventaire 08", keys: [{ mapper: 'keyboard', key: '8' }] })
    async useItem8() {
        await this.useItem(8);
    }

    @Command('inventory.use.9', { description: "Raccourci d'inventaire 09", keys: [{ mapper: 'keyboard', key: '9' }] })
    async useItem9() {
        await this.useItem(9);
    }

    @Command('inventory.use.0', { description: "Raccourci d'inventaire 10", keys: [{ mapper: 'keyboard', key: '0' }] })
    async useItem0() {
        await this.useItem(0);
    }
}
