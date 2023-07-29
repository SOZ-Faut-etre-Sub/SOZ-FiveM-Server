import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { PHARMACY_PRICES } from '@public/shared/job/lsmc';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { NuiMenu } from '../../nui/nui.menu';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCPharmacyProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Once(OnceStep.PlayerLoaded)
    public setupPharmacy() {
        const products = [
            { name: 'tissue', price: PHARMACY_PRICES.tissue, amount: 2000 },
            { name: 'antibiotic', price: PHARMACY_PRICES.antibiotic, amount: 2000 },
            { name: 'pommade', price: PHARMACY_PRICES.pommade, amount: 2000 },
            { name: 'painkiller', price: PHARMACY_PRICES.painkiller, amount: 2000 },
            { name: 'antiacide', price: PHARMACY_PRICES.antiacide, amount: 2000 },
            { name: 'health_book', price: PHARMACY_PRICES.health_book, amount: 2000 },
        ];

        const getLsmcShopProduct = products => {
            const hydratedProducts = products.map((product, id) => ({
                ...this.itemService.getItem(product.name),
                ...product,
                slot: id + 1,
            }));

            return hydratedProducts;
        };

        const model = 's_m_m_doctor_01';
        this.targetFactory.createForPed({
            model: model,
            coords: { x: 356.64, y: -1419.74, z: 31.51, w: 57.62 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Liste des médicaments',
                        icon: 'c:/ems/painkiller.png',
                        action: () => {
                            this.inventoryManager.openShopInventory(getLsmcShopProduct(products), 'menu_shop_pharmacy');
                        },
                    },
                    {
                        label: 'Soins médicaux',
                        icon: 'c:/ems/heal.png',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_NPC_HEAL);
                        },
                    },
                ],
                distance: 2.5,
            },
        });
    }
}
