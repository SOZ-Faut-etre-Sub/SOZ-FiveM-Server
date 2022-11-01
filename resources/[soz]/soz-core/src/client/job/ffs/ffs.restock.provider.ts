import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { ClothingBrand } from '../../../shared/shop';
import { InventoryManager } from '../../item/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory, TargetOptions } from '../../target/target.factory';

@Provider()
export class FightForStyleRestockProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ClientEvent.FFS_ENTER_CLOTHING_SHOP)
    public onEnterClothingShop(brand: ClothingBrand) {
        const { garments, pedModel } = this.getGarmentsFromBrand(brand);
        const targets: TargetOptions[] = garments.map(garment => {
            return {
                label: 'Restock: ' + this.itemService.getItem(garment).label,
                icon: 'c:/ffs/restock.png',
                color: 'ffs',
                job: 'ffs',
                blackoutGlobal: true,
                blackoutJob: 'ffs',
                canInteract: () => {
                    return this.playerService.isOnDuty() && this.inventoryManager.hasEnoughItem(garment, 1);
                },
                action: () => {
                    TriggerServerEvent(ServerEvent.FFS_RESTOCK, brand, garment);
                },
            };
        });
        this.targetFactory.createForModel([pedModel], targets);
    }

    @OnEvent(ClientEvent.FFS_EXIT_CLOTHING_SHOP)
    public onExitClothingShop(brand: ClothingBrand) {
        const { garments, pedModel } = this.getGarmentsFromBrand(brand);
        const labels = garments.map(garment => 'Restock: ' + this.itemService.getItem(garment).label);
        this.targetFactory.removeTargetModel([pedModel], labels);
    }

    private getGarmentsFromBrand(brand: ClothingBrand): { garments: Garment[] | LuxuryGarment[]; pedModel: string } {
        switch (brand) {
            case ClothingBrand.PONSONBYS:
                return {
                    garments: Object.values(LuxuryGarment),
                    pedModel: 's_f_m_shop_high',
                };
            case ClothingBrand.SUBURBAN:
                return {
                    garments: Object.values(Garment),
                    pedModel: 's_f_y_shop_mid',
                };
            case ClothingBrand.BINCO:
                return {
                    garments: Object.values(Garment),
                    pedModel: 's_f_y_shop_low',
                };
        }
    }
}
