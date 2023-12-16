import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobPermission } from '../../shared/job';
import { ShopProduct } from '../../shared/shop';
import { BossShop } from '../../shared/shop/boss';
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
        }));
        return hydratedProducts;
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
                ],
                2.5
            );
        });
    }
}
