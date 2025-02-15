import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { EasterShopContent } from '@public/shared/shop/easter';
import { TaxType } from '@public/shared/tax';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { ADD_ERROR_MESSAGE } from '../../shared/inventory';
import { PriceService } from '../bank/price.service';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerAppearanceService } from '../player/player.appearance.service';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class EasterShopProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerAppearanceService)
    private playerAppearanceService: PlayerAppearanceService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PriceService)
    private priceService: PriceService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('bunny_ear', this.useBunnyEar.bind(this));
    }

    private async useBunnyEar(source: number) {
        const progress = await this.progressService.progress(
            source,
            'switch_clothes',
            "Changement d'habits...",
            1000,
            {
                name: 'put_on_mask',
                dictionary: 'mp_masks@on_foot',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                disableCombat: true,
                disableMovement: true,
                canCancel: false,
            }
        );

        if (!progress.completed) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(source);
        targetPlayer.cloth_config.Config.HideHead = false;
        this.playerAppearanceService.setClothConfig(source, targetPlayer.cloth_config, true);

        TriggerClientEvent(ClientEvent.EASTER_EAR_TOGGLE, source);
    }

    @OnEvent(ServerEvent.SHOP_EASTER_BUY)
    public async onShopMaskBuy(source: number, id: string) {
        const item = EasterShopContent.find(product => product.id === id);
        if (!item) {
            return;
        }
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.canCarryItem(item.id, 1)) {
            this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
            return;
        }

        if (!(await this.playerMoneyService.buy(source, item.price, TaxType.SUPPLY))) {
            this.notifier.notify(source, "Vous avez n'avez pas assez d'argent.", 'error');
            return;
        }

        const itemData = this.itemService.getItem(item.id);

        this.monitor.traceEvent('easter_shop_buy', {
            item_id: item.id,
            player_source: source,
            item_label: itemData.label,
            item_count: 1,
            money: item.price,
        });

        inventory.add(item.id, 1, item.metadata || {});
        const taxed = await this.priceService.getPrice(item.price, TaxType.SUPPLY);
        this.notifier.notify(
            source,
            `Vous avez acheté ~b~${this.itemService.getItem(item.id).label}~s~ pour ~r~${taxed}$~s~`,
            'success'
        );
    }
}
