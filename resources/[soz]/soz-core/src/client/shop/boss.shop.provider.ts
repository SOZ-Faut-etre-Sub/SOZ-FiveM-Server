import { ServerEvent } from '@public/shared/event';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobPermission, JobType } from '../../shared/job';
import { ShopConfig, ShopProduct } from '../../shared/shop';
import { BossShop } from '../../shared/shop/boss';
import { TargetOption } from '../../shared/target';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { JobService } from '../job/job.service';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class BossShopProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(JobService)
    private jobService: JobService;

    public getHydratedProducts(products: ShopProduct[]) {
        const hydratedProducts = products.map((product, id) => ({
            ...this.itemService.getItem(product.id),
            ...product,
            slot: id + 1,
            amount: 0,
        }));
        return hydratedProducts;
    }

    private getOrders(shop: ShopConfig & { job: JobType }): TargetOption[] {
        const ret: TargetOption[] = [];
        if (!shop.orders) {
            return ret;
        }

        for (const order of shop.orders.products) {
            const item = this.itemService.getItem(order.id);
            ret.push({
                label: 'Commander un ' + item.label + ' (' + order.price + '$)',
                icon: 'c:shop/' + order.id + '.png',
                job: shop.job,
                blackoutGlobal: true,
                category: 'society',
                canInteract: () => {
                    return this.jobService.hasPermission(shop.job, JobPermission.SocietyShop);
                },
                action: () => {
                    TriggerServerEvent(ServerEvent.SHOP_BOSS_ORDER, order.id, order.price, shop.orders.targetInv);
                },
            });
        }
        return ret;
    }

    @Once(OnceStep.PlayerLoaded)
    setupBossShop() {
        BossShop.forEach(shop => {
            this.targetFactory.createForBoxZone(
                `shops:boss:${shop.name}`,
                shop.zone,
                [
                    {
                        label: 'Récupérer du matériel',
                        icon: 'fas fa-briefcase',
                        job: shop.job,
                        blackoutGlobal: true,
                        category: 'society',
                        canInteract: () => {
                            return this.jobService.hasPermission(shop.job, JobPermission.SocietyShop);
                        },
                        action: () => {
                            this.inventoryManager.openShopInventory(
                                this.getHydratedProducts(shop.products),
                                'menu_shop_society'
                            );
                        },
                    },
                    ...this.getOrders(shop),
                ],
                2.5
            );
        });
    }
}
