import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { PlayerData } from '@public/shared/player';
import { Halloween2023Scenario1, Halloween2023Scenario1Alcool } from '@public/shared/story/halloween-2023/scenario1';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { BlipFactory } from '../../blip';
import { PedFactory } from '../../factory/ped.factory';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';
import { StoryProvider } from '../story.provider';

@Provider()
export class Halloween2023Scenario1Provider {
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

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario1)) {
            return;
        }

        await this.createBeachPeds();
        await this.createHumanLabPed();
        await this.createBoatPed();
        await this.createSwampPed();

        await this.createActionZones();
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    public createBlip(player: PlayerData) {
        if (!isFeatureEnabled(Feature.Halloween2023Scenario1)) {
            return;
        }

        const startedOrFinish = !!player?.metadata?.halloween2023?.scenario1;
        if (!startedOrFinish && !this.storyService.canInteractForPart('halloween2023', 'scenario1', 0)) {
            return;
        }

        const blipId = 'halloween2023_scenario1';
        if (this.blipFactory.exist(blipId)) {
            return;
        }

        this.blipFactory.create(blipId, {
            name: 'Horror Story II : Les échoués. (P1)',
            coords: { x: -211.77, y: 6571.71, z: 10.01 },
            sprite: 484,
            scale: 0.99,
            color: 44,
        });
    }

    private async createBeachPeds() {
        this.targetFactory.createForPed({
            model: 's_m_m_fibsec_01',
            coords: { x: -211.77, y: 6571.71, z: 10.01, w: 225.11 },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_COP_IDLES',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'fas fa-comment',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario1', 0),
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 1);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part1']);
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        0,
                        'part1'
                    ),
                ],
                distance: 1.5,
            },
        });

        await this.pedFactory.createPedOnGrid({
            model: 's_m_m_armoured_02',
            coords: { x: -214.02, y: 6570.73, z: 10.01, w: 231.09 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'rcmnigel1a',
            anim: 'idle_c_2',
            flag: 1,
        });

        await this.pedFactory.createPedOnGrid({
            model: 's_m_m_armoured_02',
            coords: { x: -211.31, y: 6573.46, z: 10.02, w: 215.53 },
            invincible: true,
            freeze: true,
            blockevents: true,
            animDict: 'rcmnigel1a',
            anim: 'idle_c_2',
            flag: 1,
        });

        const crowd = [
            [-206.91, 6576.4, 11.02, 344.85],
            [-205.49, 6575.0, 11.01, 344.73],
            [-207.51, 6573.15, 11.0, 96.06],
            [-207.99, 6571.19, 10.95, 71.09],
            [-210.15, 6568.96, 10.91, 45.26],
            [-212.33, 6568.16, 10.89, 21.38],
            [-213.9, 6566.31, 10.89, 348.49],
            [-211.71, 6566.51, 10.86, 8.99],
            [-209.93, 6567.72, 10.89, 33.98],
            [-208.03, 6569.59, 10.93, 58.23],
            [-207.18, 6571.93, 10.96, 79.77],
            [-205.03, 6571.53, 10.97, 83.53],
            [-205.37, 6569.28, 10.95, 65.46],
            [-206.34, 6566.8, 10.92, 43.8],
            [-208.05, 6565.18, 10.86, 35.65],
            [-210.62, 6564.35, 10.87, 38.64],
            [-212.89, 6564.39, 10.87, 355.38],
            [-215.85, 6565.73, 10.93, 340.12],
            [-215.94, 6563.32, 10.87, 342.7],
            [-213.13, 6561.7, 10.88, 1.61],
            [-210.91, 6561.31, 10.88, 9.99],
            [-208.22, 6561.36, 10.93, 16.17],
            [-205.48, 6563.16, 10.96, 36.45],
            [-203.56, 6565.0, 10.96, 50.47],
            [-202.63, 6567.27, 10.96, 47.54],
            [-201.51, 6569.64, 10.99, 63.81],
            [-218.5, 6554.11, 10.96, 107.55],
            [-220.38, 6555.28, 10.97, 108.67],
            [-223.24, 6557.69, 10.99, 109.0],
            [-207.85, 6567.3, 10.91, 52.18],
            [-206.63, 6569.03, 10.94, 61.79],
            [-206.17, 6571.41, 10.96, 84.32],
            [-210.65, 6565.63, 10.86, 16.66],
            [-209.01, 6566.23, 10.85, 38.22],
            [-209.22, 6562.95, 10.87, 14.87],
            [-205.79, 6564.58, 10.92, 43.36],
            [-204.63, 6567.48, 10.94, 62.19],
            [-203.69, 6569.38, 10.97, 73.91],
            [-211.51, 6562.94, 10.88, 5.89],
        ];

        const model = [
            'a_f_m_prolhost_01',
            'a_m_m_socenlat_01',
            'a_f_m_skidrow_01',
            'a_f_y_eastsa_03',
            'a_m_m_beach_01',
            'a_m_m_farmer_01',
            'a_f_m_tramp_01',
            'a_m_y_beach_01',
        ];

        let index = 0;
        for (const position of crowd) {
            await this.pedFactory.createPedOnGrid({
                model: model[index++ % model.length],
                coords: { x: position[0], y: position[1], z: position[2] - 1, w: position[3] },
                invincible: true,
                freeze: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_STAND_IMPATIENT_FACILITY',
                isRandomClothes: true,
            });
        }
    }

    private async createHumanLabPed(): Promise<void> {
        this.targetFactory.createForPed({
            model: 's_f_y_scrubs_01',
            coords: { x: 3384.15, y: 3704.52, z: 34.72, w: 98.87 },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 's_m_m_fibsec_01',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'fas fa-comment',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario1', 1),
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 2);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part2']);
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        1,
                        'part2'
                    ),
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        2,
                        'part2'
                    ),
                    {
                        label: 'Donner',
                        icon: 'c:pole/livrer.png',
                        canInteract: () => {
                            if (!this.storyService.canInteractForPart('halloween2023', 'scenario1', 3)) {
                                return false;
                            }

                            if (!this.inventoryManager.hasEnoughItem('halloween_prehistoric_blood_analysis')) {
                                return false;
                            }

                            return (
                                this.inventoryManager
                                    .getItems()
                                    .reduce((acc, elem) => acc + (elem.type === 'fish' ? elem.amount : 0), 0) >= 20
                            );
                        },
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 4);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part3']);
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        3,
                        'part3'
                    ),
                ],
                distance: 1.5,
            },
        });
    }

    private async createBoatPed(): Promise<void> {
        this.targetFactory.createForPed({
            model: 'mp_m_boatstaff_01',
            coords: { x: 1011.24, y: -2889.02, z: 38.16, w: 177.96 },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'fas fa-comment',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario1', 4),
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 5);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part4']);
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        4,
                        'part4'
                    ),
                    {
                        label: 'Parler',
                        icon: 'fas fa-comment',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario1', 7),
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 8);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part7']);
                        },
                    },
                ],
                distance: 1.5,
            },
        });
    }

    private async createSwampPed(): Promise<void> {
        this.targetFactory.createForPed({
            model: 'a_m_m_mexlabor_01',
            coords: { x: -2078.09, y: 2602.39, z: 1.03, w: 200.56 },
            invincible: true,
            freeze: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_FISHING',
            target: {
                options: [
                    {
                        label: 'Parler',
                        icon: 'fas fa-comment',
                        canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario1', 5),
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 6);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part5']);
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        5,
                        'part5'
                    ),
                    {
                        label: 'Donner',
                        icon: 'c:pole/livrer.png',
                        canInteract: () => {
                            if (!this.storyService.canInteractForPart('halloween2023', 'scenario1', 6)) {
                                return false;
                            }

                            return this.inventoryManager
                                .getItems()
                                .some(item => Halloween2023Scenario1Alcool.includes(item.name));
                        },
                        action: async () => {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, 7);
                            await this.storyService.launchDialog(Halloween2023Scenario1.dialog['part6']);
                        },
                    },
                    this.storyService.replayYearTarget(
                        Halloween2023Scenario1,
                        'halloween2023',
                        'scenario1',
                        6,
                        'part6'
                    ),
                ],
                distance: 1.5,
            },
        });
    }

    private async createActionZones() {
        Halloween2023Scenario1.zones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: zone.label,
                    icon: zone.icon,
                    canInteract: () => this.storyService.canInteractForPart('halloween2023', 'scenario1', zone.part),
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
                            {
                                useAnimationService: true,
                            }
                        );

                        if (completed) {
                            TriggerServerEvent(ServerEvent.STORY_HALLOWEEN_2023_SCENARIO_1, zone.part + 1);
                        }
                    },
                },
            ]);
        });
    }
}
