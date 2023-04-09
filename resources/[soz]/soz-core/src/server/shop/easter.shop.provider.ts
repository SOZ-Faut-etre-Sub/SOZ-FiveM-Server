import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { EasterShopContent } from '@public/shared/shop/easter';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { Monitor } from '../../shared/monitor';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class EasterShopProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('bunny_ear', this.useTShirt.bind(this));
    }

    private async useTShirt(source: number) {
        const { completed } = await this.progressService.progress(source, 'bunny_ear', '', 2000, {
            dictionary: 'veh@common@fp_helmet@',
            name: 'put_on_helmet',
            flags: 15,
        });

        if (!completed) {
            return;
        }

        TriggerClientEvent(ClientEvent.EASTER_EAR_TOGGLE, source);
    }

    @OnEvent(ServerEvent.SHOP_EASTER_BUY)
    public async onShopMaskBuy(source: number, id: string) {
        const item = EasterShopContent.find(product => product.id === id);
        if (!item) {
            return;
        }

        if (!this.inventoryManager.canCarryItem(source, item.id, 1)) {
            this.notifier.notify(source, "Vous n'avez pas assez de place dans votre inventaire", 'error');
            return;
        }

        if (!this.playerMoneyService.remove(source, item.price)) {
            this.notifier.notify(source, "Vous avez n'avez pas assez d'argent.", 'error');
            return;
        }

        const itemData = this.itemService.getItem(item.id);

        this.monitor.publish(
            'easter_shop_buy',
            {
                item_id: item.id,
                player_source: source,
            },
            {
                item_label: itemData.label,
                quantity: 1,
                price: item.price,
            }
        );

        this.inventoryManager.addItemToInventory(source, item.id, 1, item.metadata || {});
        this.notifier.notify(
            source,
            `Vous avez acheté ~b~${this.itemService.getItem(item.id).label}~s~ pour ~r~${item.price}$~s~`,
            'success'
        );
    }
}
