import { BankService } from '../../client/bank/bank.service';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { Monitor } from '../../shared/monitor';
import { BossShop } from '../../shared/shop/boss';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';

@Provider()
export class BossShopProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(QBCore)
    private qbcore: QBCore;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.SHOP_BOSS_BUY)
    public async onShopMaskBuy(source: number, job: string, id: string) {
        const player = this.qbcore.getPlayer(source);
        if (!player) {
            return;
        }

        const shop = BossShop.find(shop => shop.job === job);
        if (!shop) {
            return;
        }

        const item = shop.products.find(product => product.id === id);
        if (!item) {
            return;
        }

        if (!this.inventoryManager.canCarryItem(source, item.id, 1)) {
            this.notifier.notify(source, "Vous n'avez pas assez de place dans votre inventaire", 'error');
            return;
        }

        if (!player.Functions.RemoveMoney('money', item.price)) {
            this.notifier.notify(source, `Vous n'avez pas assez d'argent`, 'error');
            return;
        }

        const itemData = this.itemService.getItem(item.id);

        this.monitor.publish(
            'boss_shop_buy',
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
