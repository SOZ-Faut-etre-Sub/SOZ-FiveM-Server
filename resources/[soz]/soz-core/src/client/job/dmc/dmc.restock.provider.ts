import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { PlayerService } from '@public/client/player/player.service';
import { ShopProvider } from '@public/client/shop/shop.provider';
import { TargetFactory } from '@public/client/target/target.factory';
import { BrandsConfig, ShopBrand } from '@public/config/shops';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';

@Provider()
export class DmcRestockProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ShopProvider)
    private shopProvider: ShopProvider;

    @OnEvent(ClientEvent.LSC_ENTER_SHOP)
    public onEnterLscShop() {
        this.targetFactory.createForModel(this.shopProvider.getBrandPedModel(BrandsConfig[ShopBrand.LsCustom]), [
            {
                label: 'Restock: Pièces d’Améliorations Certifiées',
                icon: 'c:/ffs/restock.png',
                color: JobType.DMC,
                job: JobType.DMC,
                blackoutGlobal: true,
                blackoutJob: JobType.DMC,
                canInteract: () => {
                    return (
                        this.playerService.isOnDuty() &&
                        this.inventoryManager.hasEnoughItem('ls_custom_upgrade_part', 1)
                    );
                },
                action: () => {
                    TriggerServerEvent(ServerEvent.DMC_RESTOCK);
                },
            },
        ]);
    }

    @OnEvent(ClientEvent.LSC_EXIT_SHOP)
    public onExitLscShop() {
        this.targetFactory.removeTargetModel(
            [this.shopProvider.getBrandPedModel(BrandsConfig[ShopBrand.LsCustom])],
            ['Restock: Pièces d’Améliorations Certifiées']
        );
    }
}
