import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { JobPermission, JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { ShopProduct } from '../../shared/shop';
import { BossShop } from '../../shared/shop/boss';
import { ItemService } from '../item/item.service';
import { NuiMenu } from '../nui/nui.menu';
import { Qbcore } from '../qbcore';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class BossShopProvider {
    @Inject(Qbcore)
    private qbCore: Qbcore;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ItemService)
    private itemService: ItemService;

    public async onOpenMenu(job: JobType, products: ShopProduct[]) {
        const hydratedProducts = products.map(product => ({ ...product, item: this.itemService.getItem(product.id) }));

        this.nuiMenu.openMenu(MenuType.BossShop, { job, products: hydratedProducts });
    }

    @OnNuiEvent(NuiEvent.BossShopBuy)
    public async onShopBuy({ job, id }: { job: string; id: string }) {
        TriggerServerEvent(ServerEvent.SHOP_BOSS_BUY, job, id);
    }

    @Once(OnceStep.PlayerLoaded)
    onPlayerLoaded() {
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
                            return this.qbCore.hasJobPermission(shop.job, JobPermission.SocietyShop);
                        },
                        action: this.onOpenMenu.bind(this, shop.job, shop.products),
                    },
                ],
                2.5
            );
        });
    }
}
