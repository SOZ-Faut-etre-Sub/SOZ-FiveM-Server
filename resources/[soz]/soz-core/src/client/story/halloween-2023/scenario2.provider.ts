import { BlipFactory } from '@public/client/blip';
import { EntityFactory } from '@public/client/factory/entity.factory';
import { PedFactory } from '@public/client/factory/ped.factory';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ItemService } from '@public/client/item/item.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { TaxType } from '@public/shared/bank';
import { ServerEvent } from '@public/shared/event';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { PlayerData } from '@public/shared/player';
import { toVector4Object } from '@public/shared/polyzone/vector';
import { Halloween2023Scenario2, WinePrice } from '@public/shared/story/halloween-2023/scenario2';

import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2023Scenario2Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(StoryProvider)
    private storyService: StoryProvider;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(EntityFactory)
    private entityFactory: EntityFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario2)) {
            return;
        }

        await this.createStartPeds();
        await this.createYellowJackPeds();

        await this.createActionZones();
        await this.spawnProps();
    }

    public createBlip(player: PlayerData) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario2)) {
            return;
        }

        const startedOrFinish = !!player?.metadata?.halloween2023?.scenario2;
        if (!startedOrFinish && !this.storyService.canInteractForPart('halloween2023', 'scenario2', 0)) {
            return;
        }

        const blipId = 'halloween2023_scenario2';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: 'Horror Story II : Le crystal. (P2)',
            coords: toVector4Object([2010.5, 3118.82, 46.95, 217.64]),
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
    }

    private async createStartPeds(): Promise<void> {
        this.targetFactory.createForPed({
            model: 's_f_y_scrubs_01',
            coords: toVector4Object([2012.28, 3116.63, 45.99, 28.04]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT_FACILITY',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario2', 0),
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, 1);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario2.dialog['part1'],
                                true,
                                2010.59,
                                3116.91,
                                47.01,
                                271.1,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario2,
                        'halloween2023',
                        'scenario2',
                        0,
                        'part1',
                        [2010.59, 3116.91, 47.01, 271.1]
                    ),
                    {
                        label: 'Donner',
                        icon: 'pole/livrer',
                        item: 'halloween_alien_artifact',
                        category: 'citizen',
                        canInteract: () => {
                            return this.storyService.canInteractForPart('halloween2023', 'scenario2', 6);
                        },
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, 7);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario2.dialog['part6'],
                                true,
                                2010.59,
                                3116.91,
                                47.01,
                                271.1,
                                entity
                            );
                        },
                    },
                ],
                distance: 1.5,
            },
        });
        this.pedFactory.createPedOnGrid({
            model: 'mp_m_boatstaff_01',
            coords: toVector4Object([2010.5, 3118.82, 45.95, 217.64]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
        });

        const item = this.itemService.getItem('halloween_damned_wine');
        this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            face: {
                NosePeakHeight: -0.4,
                NoseBoneTwist: 0,
                AddBodyBlemish: -1,
                NeckThickness: 0,
                NosePeakLength: 0.3,
                CheeksBoneWidth: 0,
                EyesOpening: -0.4,
                JawBoneBackLength: 0,
                LipsThickness: 0,
                Complexion: -1,
                NoseBoneHigh: 0,
                ChimpBoneLower: 0,
                NoseWidth: 0.5,
                CheeksWidth: 0,
                JawBoneWidth: 0.6,
                CheeksBoneHigh: 0,
                EyebrowHigh: 0,
                ChimpBoneLength: 0,
                ChimpBoneWidth: 0,
                NosePeakLower: 0,
                Ageing: -1,
                EyeColor: 26,
                ChimpHole: 0,
                Moles: -1,
                Blemish: 1,
                BodyBlemish: 0,
                EyebrowForward: 0.2,
            },
            tattoos: [
                { collection: 1926256505, overlay: 1745422723 },
                { collection: 1926256505, overlay: -1531355431 },
                { collection: -1398869298, overlay: -890282963 },
                { collection: -1368357453, overlay: -1621104712 },
                { collection: 598190139, overlay: 1369179057 },
            ],
            modelCustomization: { SkinMix: 0.5, ShapeMix: 0.2, Hash: 1885233650, Mother: 26, Father: 4 },
            makeup: {
                LipstickColor: 0,
                BlushType: -1,
                BlushColor: 0,
                LipstickOpacity: 1,
                LipstickType: -1,
                FullMakeupOpacity: 0.95,
                FullMakeupSecondaryColor: 17,
                FullMakeupDefaultColor: 1,
                BlushOpacity: 1,
                FullMakeupPrimaryColor: 9,
                FullMakeupType: 32,
            },
            hair: {
                ChestHairColor: 0,
                Scalp: { Collection: 'mphipster_overlays', Overlay: 'FM_Hip_M_Hair_001_e' },
                BeardType: 10,
                EyebrowOpacity: 1,
                ChestHairOpacity: 0.7,
                BeardOpacity: 1,
                BeardColor: 61,
                HairSecondaryColor: 29,
                HairType: 11,
                ChestHairType: 14,
                EyebrowColor: 61,
                HairColor: 28,
                EyebrowType: 12,
            },
            components: {
                3: [33, 0, 0],
                4: [24, 4, 0],
                6: [10, 0, 0],
                7: [31, 2, 0],
                8: [148, 10, 0],
                11: [31, 4, 0],
            },
            props: {
                0: [7, 2, 0],
            },
            coords: toVector4Object([-1928.6, 2059.94, 139.84, 347.97]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            target: {
                options: [
                    {
                        category: 'citizen',
                        label: 'Boutique',
                        icon: 'magasin/cart',
                        action: () => {
                            this.inventoryManager.openShopInventory(
                                [
                                    {
                                        amount: 0,
                                        description: item.description,
                                        label: item.label,
                                        name: item.name,
                                        slot: 1,
                                        price: WinePrice,
                                    },
                                ],
                                'menu_job_food',
                                TaxType.FOOD
                            );
                        },
                    },
                ],
                distance: 2.0,
            },
        });
    }

    private async createYellowJackPeds(): Promise<void> {
        this.targetFactory.createForPed({
            model: 'a_m_m_salton_02',
            coords: toVector4Object([1995.48, 3053.89, 46.06, 3.84]),
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'anim@heists@fleeca_bank@hostages@ped_d@',
            anim: 'flinch_loop',
            flag: 1,
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario2', 1),
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, 2);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario2.dialog['part2'],
                                true,
                                1995.03,
                                3056.09,
                                47.05,
                                209.96,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario2,
                        'halloween2023',
                        'scenario2',
                        1,
                        'part2',
                        [1995.03, 3056.09, 47.05, 209.96]
                    ),
                ],
                distance: 1.5,
            },
        });

        this.targetFactory.createForPed({
            model: 'u_m_m_filmdirector',
            coords: toVector4Object([1996.51, 3049.14, 45.73, 119.76]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'PROP_HUMAN_SEAT_DECKCHAIR',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario2', 2),
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, 3);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario2.dialog['part3'],
                                true,
                                1995.07,
                                3048.68,
                                47.22,
                                296.48,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario2,
                        'halloween2023',
                        'scenario2',
                        2,
                        'part3',
                        [1995.07, 3048.68, 47.22, 296.48]
                    ),
                    {
                        label: 'Donner',
                        icon: 'pole/livrer',
                        category: 'citizen',
                        canInteract: () => {
                            if (!this.storyService.canInteractForPart('halloween2023', 'scenario2', 3)) {
                                return false;
                            }

                            return this.inventoryManager.hasEnoughItem('halloween_damned_wine');
                        },
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, 4);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario2.dialog['part4'],
                                true,
                                1995.07,
                                3048.68,
                                47.22,
                                296.48,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario2,
                        'halloween2023',
                        'scenario2',
                        3,
                        'part4',
                        [1995.07, 3048.68, 47.22, 296.48]
                    ),
                ],
                distance: 1.5,
            },
        });

        this.targetFactory.createForPed({
            model: 'a_f_y_hiker_01',
            coords: toVector4Object([1983.0, 3024.26, 50.71, 306.59]),
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_BINOCULARS',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'global/comment',
                        category: 'citizen',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario2', 4),
                        action: async entity => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, 5);
                            await this.storyService.launchDialog(
                                Halloween2023Scenario2.dialog['part5'],
                                true,
                                1982.02,
                                3025.85,
                                51.66,
                                217.3,
                                entity
                            );
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario2,
                        'halloween2023',
                        'scenario2',
                        4,
                        'part5',
                        [1982.02, 3025.85, 51.66, 217.3]
                    ),
                ],
                distance: 1.5,
            },
        });
    }

    private async createActionZones() {
        Halloween2023Scenario2.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    category: 'citizen',
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario2', zone.part),
                    action: async () => {
                        const { completed } = await this.progressService.progress(
                            'Recherche',
                            'Vous recherchez...',
                            5000,
                            {
                                dictionary: 'missfbi4prepp1',
                                name: '_bag_pickup_garbage_man',
                                options: {
                                    enablePlayerControl: false,
                                    repeat: true,
                                },
                            },
                            {}
                        );

                        if (completed) {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_2, zone.part + 1);
                        }
                    },
                },
            ]);
        });
    }

    private async spawnProps() {
        for (const prop of Halloween2023Scenario2.props) {
            await this.entityFactory.createEntityWithRotation(GetHashKey(prop.model), ...prop.coords, ...prop.rotation);
        }
    }
}
