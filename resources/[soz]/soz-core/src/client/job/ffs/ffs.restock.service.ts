import { ShopService } from '@public/client/shop/shop.service';
import { ShopBrand } from '@public/config/shops';
import { JobType } from '@public/shared/job';

import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ServerEvent } from '../../../shared/event';
import { Garment, LuxuryGarment } from '../../../shared/job/ffs';
import { TargetOption } from '../../../shared/target';
import { ItemService } from '../../item/item.service';

@Injectable()
export class FightForStyleRestockService {
    @Inject(ShopService)
    private shopService: ShopService;

    @Inject(ItemService)
    private itemService: ItemService;

    public getStockTargets() {
        const targets: TargetOption[] = [];
        for (const brand of [ShopBrand.Ponsonbys, ShopBrand.Suburban, ShopBrand.Binco]) {
            const garments = this.getGarmentsFromBrand(brand);
            for (const garment of garments) {
                const target: TargetOption = {
                    label: 'Restock: ' + this.itemService.getItem(garment).label,
                    icon: 'ffs/restock',
                    job: JobType.Ffs,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Ffs,
                    category: 'society',
                    canInteract: entity => this.shopService.checkTarget([brand], entity),
                    action: () => {
                        TriggerServerEvent(ServerEvent.FFS_RESTOCK, brand, garment);
                    },
                    item: garment,
                };
                targets.push(target);
            }
        }

        return targets;
    }

    private getGarmentsFromBrand(brand: ShopBrand): Garment[] | LuxuryGarment[] {
        switch (brand) {
            case ShopBrand.Ponsonbys:
                return Object.values(LuxuryGarment);
            case ShopBrand.Suburban:
            case ShopBrand.Binco:
                return [
                    Garment.TOP,
                    Garment.PANT,
                    Garment.SHOES,
                    Garment.UNDERWEAR,
                    Garment.BAG,
                    Garment.GLOVES,
                    Garment.UNDERWEAR_TOP,
                ];
        }
    }
}
