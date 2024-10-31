import { Provider } from '@core/decorators/provider';
import { FISHING_PRICES } from '@private/config/fishing';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import { toVector4Object, Vector4 } from '../../shared/polyzone/vector';
import { FeatureProvider } from '../feature/feature.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class QueenHarvestProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(Notifier)
    private notifier: Notifier;
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

    private queenPosition: Vector4 = [667.8741, 1282.325, 360.85, 259.64];

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        await this.targetFactory.createForPed({
            model: 'mp_f_freemode_01',
            coords: toVector4Object(this.queenPosition),
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            scenario: 'PROP_HUMAN_SEAT_DECKCHAIR',

            modelCustomization: {
                SkinMix: 0.4,
                Hash: -1667301416,
                ShapeMix: 0.9,
                Mother: 21,
                Father: 6,
            },
            components: {
                3: [251, 0, 0],
                4: [63, 2, 0],
                6: [160, 0, 0],
                7: [154, 0, 0],
                8: [14, 0, 0],
                9: [54, 1, 0],
                11: [618, 3, 0],
            },
            props: {
                2: [7, 0, 0],
                6: [14, 0, 0],
                7: [10, 0, 0],
            },
            face: {
                CheeksBoneWidth: 0,
                JawBoneWidth: 0,
                JawBoneBackLength: 0,
                EyebrowForward: 0,
                BodyBlemish: -1,
                ChimpBoneWidth: 0,
                NoseWidth: 0,
                NosePeakLength: 0,
                NoseBoneHigh: 0,
                ChimpBoneLower: 0,
                Complexion: -1,
                NeckThickness: 0,
                CheeksWidth: 0,
                NosePeakHeight: 0,
                NosePeakLower: 0,
                NoseBoneTwist: 0,
                CheeksBoneHigh: 0,
                Ageing: -1,
                AddBodyBlemish: -1,
                EyesOpening: 0,
                ChimpHole: 0,
                ChimpBoneLength: 0,
                Moles: -1,
                LipsThickness: -0.3,
                EyebrowHigh: 0,
                EyeColor: 17,
                Blemish: -1,
            },
            hair: {
                HairType: 120,
                HairColor: 29,
                HairSecondaryColor: 29,
                BeardOpacity: 1,
                EyebrowOpacity: 1,
                BeardType: -1,
                ChestHairType: -1,
                BeardColor: 0,
                EyebrowColor: 8,
                ChestHairColor: 0,
                EyebrowType: 1,
                ChestHairOpacity: 1,
            },
            makeup: {
                LipstickOpacity: 0.7,
                BlushOpacity: 0.4,
                FullMakeupType: 1,
                FullMakeupDefaultColor: 1,
                FullMakeupOpacity: 1,
                FullMakeupPrimaryColor: 0,
                BlushType: 0,
                BlushColor: 6,
                FullMakeupSecondaryColor: 0,
                LipstickType: 6,
                LipstickColor: 0,
            },

            target: {
                options: [
                    {
                        label: 'Sucer',
                        category: 'citizen',
                        icon: 'halloween/sucer',
                        action: async () => {
                            const playerPed = PlayerPedId();
                            TaskTurnPedToFaceCoord(
                                playerPed,
                                this.queenPosition[0],
                                this.queenPosition[1],
                                this.queenPosition[2],
                                500
                            );
                            await wait(500);

                            TriggerServerEvent(ServerEvent.HALLOWEEN_BLOOD_HARVEST);
                        },
                    },
                    {
                        label: 'Quête',
                        category: 'citizen',
                        icon: 'global/search',
                        action: () => {
                            this.notifier.notify(
                                "Écoute attentivement, mortel… ~r~Soixante-six Coupes de Sang ont été éparpillées aux confins de cette île~s~, chacune placée avec soin pour ceux capables d'en saisir la puissance. Chaque entreprise détient sa propre coupe, tandis que les autres demeurent cachées dans les ténèbres, en attente de leur maître. ~r~Peut-être que la récompense te sera accordée, si tu as le courage de toutes les retrouver~s~.",
                                'success',
                                21_000
                            );
                        },
                    },
                    {
                        label: 'Boutique de Sang',
                        icon: 'fishing/fishing-rod',
                        category: 'citizen',
                        canInteract: () => this.featureProvider.isFeatureEnabled(Feature.Vampire),
                        action: () => {
                            const FishingProducts = [
                                {
                                    ...this.itemService.getItem('vampire_blood_bait'),
                                    price: FISHING_PRICES.vampire_blood_bait,
                                    amount: 0,
                                    slot: 1,
                                },
                            ];

                            this.inventoryManager.openShopInventory(FishingProducts, 'menu_shop_queen');
                        },
                    },
                ],
                distance: 2.5,
            },
        });
    }
}
