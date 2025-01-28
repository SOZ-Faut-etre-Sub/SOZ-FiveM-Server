import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { PlayerService } from '@public/client/player/player.service';
import { Feature } from '@public/shared/features';
import { PHARMACY_PRICES } from '@public/shared/job/lsmc';
import { toVector4Object } from '@public/shared/polyzone/vector';
import { TaxType } from '@public/shared/tax';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { FeatureProvider } from '../../feature/feature.provider';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCPharmacyProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once(OnceStep.PlayerLoaded)
    public setupPharmacy() {
        const products = [
            { name: 'tissue', price: PHARMACY_PRICES.tissue },
            { name: 'antibiotic', price: PHARMACY_PRICES.antibiotic },
            { name: 'pommade', price: PHARMACY_PRICES.pommade },
            { name: 'painkiller', price: PHARMACY_PRICES.painkiller },
            { name: 'antiacide', price: PHARMACY_PRICES.antiacide },
            { name: 'health_book', price: PHARMACY_PRICES.health_book },
        ];
        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            products.push({ name: 'horrific_lollipop', price: 15 });
        }

        const getLsmcShopProduct = products => {
            const hydratedProducts = products.map((product, id) => ({
                ...this.itemService.getItem(product.name),
                ...product,
                slot: id + 1,
                amount: 0,
            }));

            return hydratedProducts;
        };

        const model = 's_m_m_doctor_01';
        this.targetFactory.createForPed({
            model: model,
            coords: toVector4Object([371.75, -1397.15, 31.51, 56.43]),
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
                        icon: 'ems/painkiller',
                        category: 'citizen',
                        action: () => {
                            this.inventoryManager.openShopInventory(
                                getLsmcShopProduct(products),
                                'Pharmacie',
                                TaxType.SERVICE
                            );
                        },
                    },
                    {
                        label: 'Soins médicaux',
                        icon: 'ems/heal',
                        category: 'citizen',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_NPC_HEAL);
                        },
                    },
                    {
                        label: "Lever de l'ITT",
                        icon: 'ems/Rehabiliter',
                        category: 'citizen',
                        canInteract: () => {
                            const player = this.playerService.getPlayer();
                            return player.metadata.itt && Date.now() > player.metadata.itt_end;
                        },
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_TOOGLE_ITT, GetPlayerServerId(PlayerId()));
                        },
                    },
                ],
                distance: 2.5,
            },
        });
    }
}
