import { CraftService } from '@public/client/craft/craft.service';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { JobType } from '@public/shared/job';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { ShopProduct } from '@public/shared/shop';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { CraftZones } from '../../../shared/job/food';

@Provider()
export class FoodCraftProvider {
    @Inject(CraftService)
    private craftService: CraftService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    public getHydratedProducts(products: ShopProduct[]) {
        return products.map(product => ({
            ...this.itemService.getItem(product.id),
            price: product.price,
            metadata: product.metadata,
        }));
    }

    @Once(OnceStep.PlayerLoaded)
    public setupFoodCraft() {
        this.craftService.createBtargetZoneCraft(CraftZones, 'food/chef', 'Préparations du Chateau', JobType.Food);
        this.craftService.createBtargetZoneCraft(
            CraftZones,
            'food/chef',
            'Préparations de la Ferme',
            JobType.Food,
            null,
            JobType.FDF
        );

        this.targetFactory.createForBoxZone(
            `shops:food:fdf`,
            new BoxZone([-1892.55, 2072.07, 140.98], 1.0, 1.6, {
                heading: 98.98,
                minZ: 139.98,
                maxZ: 141.98,
            }),
            [
                {
                    label: 'Récupérer des matières premières',
                    icon: 'shop/briefcase',
                    job: JobType.Food,
                    blackoutGlobal: true,
                    category: 'society',
                    action: () => {
                        this.inventoryManager.openShopInventory(
                            this.getHydratedProducts([
                                { id: 'potato', type: 'food', price: 15 },
                                { id: 'lemon', type: 'food', price: 15 },
                                { id: 'corn', type: 'food', price: 15 },
                                { id: 'tomato', type: 'food', price: 15 },
                                { id: 'cabage', type: 'food', price: 15 },
                                { id: 'apple', type: 'food', price: 15 },
                                { id: 'orange', type: 'food', price: 15 },
                                { id: 'pumpkin_fresh', type: 'food', price: 15 },
                                { id: 'milk', type: 'drink', price: 10 },
                                { id: 'semi_skimmed_milk', type: 'drink', price: 10 },
                                { id: 'skimmed_milk', type: 'drink', price: 10 },
                            ]),
                            'Société'
                        );
                    },
                },
            ],
            2.5
        );
    }
}
