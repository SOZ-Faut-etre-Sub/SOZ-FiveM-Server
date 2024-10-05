import { Feature } from '@public/shared/features';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { ClothingBrand } from '../../../shared/shop';
import { TargetOption } from '../../../shared/target';
import { FeatureProvider } from '../../feature/feature.provider';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

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

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @OnEvent(ClientEvent.FFS_ENTER_CLOTHING_SHOP)
    public onEnterClothingShop(brand: ClothingBrand) {
        const { garments, pedModel } = this.getGarmentsFromBrand(brand);
        const targets: TargetOption[] = garments.map(garment => {
            return {
                label: 'Restock: ' + this.itemService.getItem(garment).label,
                icon: 'ffs/restock',
                job: 'ffs',
                blackoutGlobal: true,
                blackoutJob: 'ffs',
                category: 'society',
                action: () => {
                    TriggerServerEvent(ServerEvent.FFS_RESTOCK, brand, garment);
                },
                item: garment,
            } as TargetOption;
        });
        this.targetFactory.createForModel([pedModel], targets);
    }

    @OnEvent(ClientEvent.FFS_EXIT_CLOTHING_SHOP)
    public onExitClothingShop(brand: ClothingBrand) {
        const { pedModel } = this.getGarmentsFromBrand(brand);
        this.targetFactory.removeTargetModel([pedModel]);
    }

    private getGarmentsFromBrand(brand: ClothingBrand): { garments: Garment[] | LuxuryGarment[]; pedModel: string } {
        switch (brand) {
            case ClothingBrand.PONSONBYS:
                return {
                    garments: Object.values(LuxuryGarment),
                    pedModel: this.featureProvider.isFeatureEnabled(Feature.Halloween)
                        ? 'u_m_y_zombie_01'
                        : 's_f_m_shop_high',
                };
            case ClothingBrand.SUBURBAN:
                return {
                    garments: [
                        Garment.TOP,
                        Garment.PANT,
                        Garment.SHOES,
                        Garment.UNDERWEAR,
                        Garment.BAG,
                        Garment.GLOVES,
                        Garment.UNDERWEAR_TOP,
                    ],
                    pedModel: this.featureProvider.isFeatureEnabled(Feature.Halloween)
                        ? 'u_m_y_zombie_01'
                        : 's_f_y_shop_mid',
                };
            case ClothingBrand.BINCO:
                return {
                    garments: [
                        Garment.TOP,
                        Garment.PANT,
                        Garment.SHOES,
                        Garment.UNDERWEAR,
                        Garment.BAG,
                        Garment.GLOVES,
                        Garment.UNDERWEAR_TOP,
                    ],
                    pedModel: this.featureProvider.isFeatureEnabled(Feature.Halloween)
                        ? 'u_m_y_zombie_01'
                        : 's_f_y_shop_low',
                };
        }
    }
}
