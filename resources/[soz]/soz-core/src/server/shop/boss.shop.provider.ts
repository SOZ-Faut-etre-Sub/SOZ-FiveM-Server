import { Tick, TickInterval } from '@public/core/decorators/tick';
import { ServerEvent } from '@public/shared/event/server';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';

type Order = {
    date: number;
    item: string;
    inv: string;
    citizenId: string;
};

const prdDelay = 4 * 3600 * 1000;
const tstDelay = 3 * 60 * 1000;

@Provider()
export class BossShopProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(ItemService)
    private itemService: ItemService;

    private orders = new Set<Order>();

    @OnEvent(ServerEvent.SHOP_BOSS_ORDER)
    public onBossOrder(source: number, itemId: string, price: number, inv: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!this.playerMoneyService.remove(source, price)) {
            this.notifier.notify(source, `Vous n'avez pas assez d'argent.`, 'error');
            return;
        }
        this.orders.add({
            date: Date.now(),
            inv: inv,
            item: itemId,
            citizenId: player.citizenid,
        });

        const item = this.itemService.getItem(itemId);
        this.notifier.notify(source, 'Vous avez commandé un ~g~' + item.label);

        this.monitor.traceEvent('boss_shop_order', {
            player_source: source,
            inventory_id: inv,
            item_id: item.name,
            money: price,
        });
    }

    @Tick(TickInterval.EVERY_MINUTE)
    public shopOrderTick() {
        const delay = GetConvar('soz_core_environment', 'development') == 'production' ? prdDelay : tstDelay;
        const delayDate = Date.now() - delay;
        for (const order of this.orders) {
            if (order.date < delayDate) {
                this.inventoryManager.addItemToInventoryNotPlayer(order.inv, order.item);
                this.monitor.traceEvent('boss_shop_deliver_order', {
                    player_source: source,
                    inventory_id: order.inv,
                    item_id: order.item,
                });

                const player = this.playerService.getPlayerByCitizenId(order.citizenId);
                if (player && player.source) {
                    const item = this.itemService.getItem(order.item);
                    this.notifier.notify(player.source, 'Votre commande de ~g~' + item.label + '~s~ a été livrée');
                }
                this.orders.delete(order);
            }
        }
    }
}
